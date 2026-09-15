"""Add a looping Eat animation to the existing Ruby/Dolly cow GLB."""

import bpy
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.abspath(os.path.join(HERE, "../../return-cow-to-pasture/assets/ruby.glb"))
OUT_DIR = os.path.abspath(os.path.join(HERE, "../assets/3d"))
BLEND_OUT = os.path.join(HERE, "dolly_eating.blend")
GLB_OUT = os.path.join(OUT_DIR, "dolly-eating.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SOURCE)

scene = bpy.context.scene
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 72

rig = bpy.data.objects.get("Ruby Farm Rig")
if rig is None:
    raise RuntimeError("Ruby Farm Rig was not found in the source GLB")

# Preserve the imported walk action while authoring a separate reusable loop.
walk_action = rig.animation_data.action if rig.animation_data else None
if walk_action:
    walk_action.name = "Walk"

rig.animation_data_create()
rig.animation_data.action = None
eat = bpy.data.actions.new("Eat")
rig.animation_data.action = eat

neck = rig.pose.bones["neck"]
head = rig.pose.bones["head"]
spine = rig.pose.bones["spine"]
fore_l = rig.pose.bones["fore.L.upper"]
fore_r = rig.pose.bones["fore.R.upper"]

for bone in (neck, head, spine, fore_l, fore_r):
    bone.rotation_mode = "XYZ"


def pose(frame, neck_x, head_x, head_y=0.0, spine_z=0.0, stance=0.0):
    # The imported glTF bones point along local Y; local Z bends the neck in
    # the cow's side-view plane while local X adds a tiny chewing tilt.
    neck.rotation_euler = (0, 0, math.radians(-neck_x))
    head.rotation_euler = (math.radians(head_y), 0, math.radians(-head_x))
    spine.rotation_euler = (0, math.radians(spine_z), 0)
    fore_l.rotation_euler = (math.radians(stance), 0, 0)
    fore_r.rotation_euler = (math.radians(-stance), 0, 0)
    for bone in (neck, head, spine, fore_l, fore_r):
        bone.keyframe_insert("rotation_euler", frame=frame, group=bone.name)


# Lower the head, settle at the feeder, chew three times, then loop smoothly.
pose(1, 0, 0)
pose(10, 18, 14, stance=1.5)
pose(20, 35, 25, stance=2.5)
pose(28, 38, 20, -2.5, 0.7, 2.5)
pose(36, 35, 27, 2.0, -0.5, 2.5)
pose(44, 38, 20, -2.0, 0.7, 2.5)
pose(52, 35, 27, 2.5, -0.5, 2.5)
pose(60, 20, 14, 0, 0, 1.5)
pose(72, 0, 0)

# Blender 5 actions use layered channel bags. Keyframes default to Bezier, and
# matching poses at frames 1 and 72 make this clip loop without a visible pop.

# Store actions in NLA so both Walk and Eat survive the GLB export.
rig.animation_data.action = None
if walk_action:
    track = rig.animation_data.nla_tracks.new()
    track.name = "Walk"
    track.mute = True
    track.strips.new("Walk", int(walk_action.frame_range[0]), walk_action)
eat_track = rig.animation_data.nla_tracks.new()
eat_track.name = "Eat"
eat_track.strips.new("Eat", 1, eat)

os.makedirs(OUT_DIR, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUT)
bpy.ops.export_scene.gltf(
    filepath=GLB_OUT,
    export_format="GLB",
    export_animations=True,
    export_animation_mode="NLA_TRACKS",
    export_force_sampling=True,
    export_frame_range=True,
)
print(f"Saved Blender source: {BLEND_OUT}")
print(f"Saved animated GLB: {GLB_OUT}")

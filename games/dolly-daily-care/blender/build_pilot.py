import bpy
import math
from mathutils import Vector

# Run with: blender --background --python build_pilot.py
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 800
scene.render.resolution_y = 520
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = '../assets/animation/milking/frame_####.png'
scene.render.fps = 24
scene.frame_start, scene.frame_end = 1, 48
bpy.ops.object.camera_add(location=(0, 0, 10))
camera = bpy.context.object
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 5.2
camera.rotation_euler = (0, 0, 0)
scene.camera = camera

# The original art is retained as a reference plate while the 2D cut-out rig is built.
img = bpy.data.images.load('../../farm/assets/RU Cow 2.png')
mat = bpy.data.materials.new('Dolly reference')
mat.diffuse_color = (1, 1, 1, 1)
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get('Principled BSDF')
tex = mat.node_tree.nodes.new('ShaderNodeTexImage')
tex.image = img
mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
mat.node_tree.links.new(tex.outputs['Alpha'], bsdf.inputs['Alpha'])
bsdf.inputs['Roughness'].default_value = 1

bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
plate = bpy.context.object
plate.name = 'Dolly_reference_plate'
plate.scale = (2.2, 1.56, 1)
plate.data.materials.append(mat)

# A separate control rig is created now so the final cut-out pieces can be swapped in without changing animation timing.
bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0.05))
rig = bpy.context.object
rig.name = 'Dolly_2D_Rig'
arm = rig.data
arm.name = 'Dolly_2D_Rig'
root = arm.edit_bones[0]
root.name = 'root'
root.head, root.tail = (-0.1, 0, 0), (0.1, 0, 0)
for name, head, tail, parent in [
    ('body', (0, 0, 0), (0.9, 0, 0), root),
    ('head', (0.75, 0, 0), (1.15, 0.18, 0), root),
    ('tail', (-0.75, 0, 0), (-1.2, 0.2, 0), root),
    ('udder', (0.2, -0.02, 0), (0.2, -0.35, 0), root),
]:
    b = arm.edit_bones.new(name)
    b.head, b.tail, b.parent = head, tail, parent
bpy.ops.object.mode_set(mode='POSE')
for name, angle in [('body', 0.025), ('head', -0.08), ('tail', 0.16), ('udder', 0.05)]:
    p = rig.pose.bones[name]
    p.rotation_mode = 'XYZ'
    p.rotation_euler[1] = angle
    p.keyframe_insert('rotation_euler', frame=1)
    p.rotation_euler[1] = -angle
    p.keyframe_insert('rotation_euler', frame=24)
    p.rotation_euler[1] = angle
    p.keyframe_insert('rotation_euler', frame=48)
bpy.ops.object.mode_set(mode='OBJECT')

# Keep the reference plate attached to the body control for the first timing pass.
# Once the artwork is split into transparent cut-out layers, those layers reuse
# the same named bones and keyframes.
plate.parent = rig
plate.parent_type = 'BONE'
plate.parent_bone = 'body'

scene.world = bpy.data.worlds.new('Dolly World')
scene.world.color = (0.84, 0.91, 0.86)
bpy.ops.wm.save_as_mainfile(filepath='dolly_milking_pilot.blend')

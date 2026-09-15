"""Prepare a TRELLIS.2 Dolly GLB for rigging and web animation.

Run with:
  blender --background --python prepare_trellis_dolly.py -- ../assets/3d/dolly-trellis.glb
"""

import bpy
import os
import sys


def input_path():
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if not args:
        raise SystemExit("Pass the TRELLIS.2 GLB path after --")
    return os.path.abspath(args[0])


source = input_path()
if not os.path.exists(source):
    raise SystemExit(f"TRELLIS.2 GLB not found: {source}")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=source)

meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
if not meshes:
    raise SystemExit("The GLB contains no mesh objects")

for obj in meshes:
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    for material in obj.data.materials:
        if material:
            material.blend_method = "HASHED"

# Normalize Dolly around the origin while preserving all generated mesh parts.
mins = [min(obj.bound_box[i][axis] + obj.location[axis] for obj in meshes for i in range(8)) for axis in range(3)]
maxs = [max(obj.bound_box[i][axis] + obj.location[axis] for obj in meshes for i in range(8)) for axis in range(3)]
center = [(mins[i] + maxs[i]) * 0.5 for i in range(3)]
largest = max(maxs[i] - mins[i] for i in range(3)) or 1
scale = 4.0 / largest
for obj in meshes:
    obj.location = [(obj.location[i] - center[i]) * scale for i in range(3)]
    obj.scale = (scale, scale, scale)

# Keep the high-detail source and create a web-ready duplicate collection later.
source_collection = bpy.data.collections.new("Dolly_TRELLIS_Source")
bpy.context.scene.collection.children.link(source_collection)
for obj in meshes:
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source_collection.objects.link(obj)

output = os.path.join(os.path.dirname(__file__), "dolly_trellis_ready.blend")
bpy.ops.wm.save_as_mainfile(filepath=output)
print(f"Prepared TRELLIS.2 Dolly: {output}")

import os
import shutil

from jinja2 import Environment, FileSystemLoader

import mistune

from . import blog, render
from .constants import *
from .utils import load_yaml


def write_files(env, pages):
    for p in pages:
        # ignore headlines:
        if '_headlines' in p:
            continue
        data = load_yaml(p)
        content = data.copy()
        content.pop('layout', None)
        content.pop('title', None)
        result = env.get_template(data['layout'] + '.html').render(data=data, content=content)

        new_path = p.replace(SRC_DIR, DIST_DIR)
        new_path = new_path.replace('.yml', '.html')
        os.makedirs(os.path.dirname(new_path), exist_ok=True)
        print(new_path)
        with open(new_path, 'w') as f:
            f.write(result)


def load_files(sub_dir=None):
    if sub_dir is not None:
        path = os.path.join(SRC_DIR, sub_dir)
    else:
        path = SRC_DIR
    for root, dirs, files in os.walk(path):
        for file_ in files:
            out = os.path.join(root, file_)
            yield out


def copy_static_files():
    dest = os.path.join(DIST_DIR, STATIC_DIR)
    shutil.rmtree(dest, ignore_errors=True)
    shutil.copytree(STATIC_DIR, dest)


def copy_public_files():
    dest = os.path.join(DIST_DIR)
    shutil.copytree(PUBLIC_DIR, dest)


def copy_src_files():
    dest = os.path.join(DIST_DIR, SRC_DIR)
    shutil.rmtree(dest, ignore_errors=True)
    shutil.copytree(SRC_DIR, dest)

def build():
    env = render.setup_jinja()
    shutil.rmtree(DIST_DIR, ignore_errors=True)
    copy_public_files()
    copy_static_files()
    blog.write_blog_index(env, load_files(sub_dir='_headlines'))
    write_files(env, load_files())

#!/usr/bin/env python
import collections
import os
import shutil
from time import sleep

import ipdb
import mistune
import yaml
from jinja2 import Environment, FileSystemLoader

from static_gen import render

SRC_DIR = 'src'
STATIC_DIR = 'static'
PUBLIC_DIR = 'public'
DIST_DIR = 'dist'

_mapping_tag = yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG


def dict_representer(dumper, data):
    return dumper.represent_dict(data.iteritems())


def dict_constructor(loader, node):
    return collections.OrderedDict(loader.construct_pairs(node))


yaml.add_representer(collections.OrderedDict, dict_representer)
yaml.add_constructor(_mapping_tag, dict_constructor)


def load_yaml(p):
    with open(p, 'r') as f:
        raw = f.read()
    return yaml.load(raw)


def write_files(env, pages):
    for p in pages:
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
        # todo ignore if folder starts with _
        for file_ in files:
            yield os.path.join(root, file_)


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


def _extract_tags(post):
    tags = post['tags'].split(',')
    tags = [t.strip() for t in tags]
    return tags


def extract_tags(posts):
    tags = [_extract_tags(p) for p in posts]
    # flatten lists:
    tags = [item for sublist in tags for item in sublist]
    return list(set(tags))


def write_blog_index(env, files):
    """
    Each post has already been written to the dist folder.

    So, here, we just need to build the paginated index and the tags pages.
    """
    posts = []
    for f in files:
        post = load_yaml(f)
        post['path'] = f.replace(SRC_DIR, '')
        posts.append(post)

    tags = extract_tags(posts)

    result = env.get_template('headlines.html').render({'posts': posts, 'data': {'title': 'Headlines'}})

    path = os.path.join(DIST_DIR, 'headlines.html')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(result)


def main():
    env = render.setup_jinja()
    shutil.rmtree(DIST_DIR, ignore_errors=True)
    copy_public_files()
    copy_static_files()
    write_blog_index(env, load_files(sub_dir='_headlines'))
    write_files(env, load_files())


if __name__ == '__main__':
    main()

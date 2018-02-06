import collections

import yaml

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


def group_into(l, n=6):
    """
    Partition list into sub-lists of `n` items.
    l: list
    n: number of items in each sublist
    """
    for i in range(0, len(l), n):
        yield l[i:i + n]


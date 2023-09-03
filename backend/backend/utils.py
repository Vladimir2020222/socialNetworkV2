def word_to_camel_case(word: str):
    parts = word.split('_')
    return parts[0].lower() + ''.join([part.title() for part in parts[1:]])


def transform_dict_keys_to_camel_case(data: dict):
    data = data.items()
    data = {word_to_camel_case(i[0]): i[1] for i in data}
    return data

import os

# Чёрный список директорий/файлов, которые нужно пропускать (относительные имена)
BLACKLIST = {
    '.git',
    '__pycache__',
    '.DS_Store',
    'node_modules',
    '.venv',
    '.idea',
    '.mypy_cache',
    '.pytest_cache',
    'tree.py'
}

def print_tree(start_path='.', prefix=''):
    try:
        entries = sorted(os.listdir(start_path))
    except PermissionError:
        return

    # Пропускаем скрытые файлы и те, что в чёрном списке
    entries = [e for e in entries if e not in BLACKLIST]
    pointers = ['├──'] * (len(entries) - 1) + ['└──']

    for pointer, entry in zip(pointers, entries):
        path = os.path.join(start_path, entry)
        print(prefix + pointer + ' ' + entry)

        if os.path.isdir(path):
            extension = '│   ' if pointer == '├──' else '    '
            print_tree(path, prefix + extension)

if __name__ == '__main__':
    print_tree('.')

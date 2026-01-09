# 自动生成版本信息等数据
import os
import json
import shutil

version_log_file = 'docs/docs/version-log.md'
changelog_file = 'CHANGELOG.md'
package_file = 'package.json'

# 检查 package.json 文件
if not os.path.exists(package_file):
    print(f"文件 {package_file} 不存在，请检查路径。")
else:
    with open(package_file, 'r', encoding='utf-8') as f:
        package_data = json.load(f)
        version = package_data.get('version', '0.0.0')

    # 检查 version-log.md 文件
    if not os.path.exists(version_log_file):
        print(f"文件 {version_log_file} 不存在，请检查路径。")
    else:
        with open(version_log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # 查找第一个版本标题（## 开头）
        version_log_version = '0.0.0'
        for line in lines:
            stripped_line = line.strip()
            if stripped_line.startswith('##'):
                # 提取版本号（例如：## 1.5.24 -> 1.5.24）
                version_log_version = stripped_line.split(' ')[-1]
                break

        # 仅在版本号不一致时才更新 version-log.md
        if version != version_log_version:
            if not os.path.exists(changelog_file):
                print(f"文件 {changelog_file} 不存在，请检查路径。")
            else:
                with open(changelog_file, 'r', encoding='utf-8') as f:
                    changelog_content = f.read()

                # 读取现有文件内容
                with open(version_log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()

                # 构建新内容：在一级标题后插入新版本
                new_lines = []
                inserted = False

                for line in lines:
                    new_lines.append(line)
                    # 在一级标题后插入新版本内容
                    if line.strip().startswith('# ') and not inserted:
                        new_lines.append(f'\n## {version}\n\n{changelog_content}\n\nhttps://github.com/anghunk/linuxdo-scripts/releases/tag/{version}\n')
                        inserted = True

                # 如果没有找到一级标题，则在文件开头插入
                if not inserted:
                    new_lines.insert(0, f'## {version}\n\n{changelog_content}\n\nhttps://github.com/anghunk/linuxdo-scripts/releases/tag/{version}\n\n')

                # 写回文件
                with open(version_log_file, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)

                print(f"已更新 {version_log_file} 文件，版本号为 {version}。")
        else:
            print(f"版本号 {version} 已存在于 {version_log_file} 中，无需更新。")
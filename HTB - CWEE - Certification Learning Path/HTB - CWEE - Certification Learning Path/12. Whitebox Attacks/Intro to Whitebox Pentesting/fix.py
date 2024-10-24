import os

new_content = '''<link rel="preload" as="style" href="./css/bootstrap-dark-37a520b2.css" />
<link rel="preload" as="style" href="./css/app-dark-341cd2e1.css" />
<link rel="preload" as="style" href="./css/icons-541b9943.css" />
<link rel="preload" as="style" href="./css/prism-8ad01d51.css" />
<link rel="stylesheet" href="./css/bootstrap-dark-37a520b2.css" />
<link rel="stylesheet" href="./css/app-dark-85a271d1.css" />
<link rel="stylesheet" href="./css/icons-541b9943.css" />
<link rel="stylesheet" href="./css/assets/prism-8ad01d51.css" />
'''

for filename in os.listdir('.'):
    if filename.endswith('.htm'):
        with open(filename, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        if len(lines) >= 14:
            lines[13] = new_content + '\n'
        
        with open(filename, 'w', encoding='utf-8') as file:
            file.writelines(lines)

print("Done")

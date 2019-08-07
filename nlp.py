from sys import stdin
positive_words = [
    'happy', 
    'positive',
    'sunny',
    'joy',
    'joyful',
    'peace']

# negative_words = [
#     'sad',
#     'angry',
#     'disappointed',
#     'sorrowful' 
# ]

msg = stdin.readline()
if any(s in msg for s in positive_words):
    how = True
else:
    how = False

print(how)
import os
import re

FILES = ['app.js', 'cbt.html', 'index.html', 'school-portal.html', 'teacher.html', 'parent.html', 'admin.html', 'landing.html', 'register.html']

EMOJI_TO_LUCIDE = {
    '🎓': '<i data-lucide="graduation-cap"></i>',
    '📝': '<i data-lucide="edit-3"></i>',
    '📚': '<i data-lucide="book"></i>',
    '🚀': '<i data-lucide="rocket"></i>',
    '🚩': '<i data-lucide="flag"></i>',
    '🎉': '<i data-lucide="party-popper"></i>',
    '🔄': '<i data-lucide="refresh-cw"></i>',
    '🏠': '<i data-lucide="home"></i>',
    '📋': '<i data-lucide="clipboard-list"></i>',
    '🏆': '<i data-lucide="trophy"></i>',
    '📈': '<i data-lucide="trending-up"></i>',
    '💪': '<i data-lucide="dumbbell"></i>',
    '🇳🇬': '',
    '🔥': '<i data-lucide="flame"></i>',
    '✨': '<i data-lucide="sparkles"></i>',
    '🍃': '<i data-lucide="leaf"></i>',
    '🌿': '<i data-lucide="leaf"></i>',
    '😊': '<i data-lucide="smile"></i>',
    '😐': '<i data-lucide="meh"></i>',
    '😔': '<i data-lucide="frown"></i>',
    '💨': '<i data-lucide="wind"></i>',
    '🧘': '<i data-lucide="activity"></i>',
    '🛡️': '<i data-lucide="shield"></i>',
    '👩‍🏫': '<i data-lucide="users"></i>',
    '👨‍👩‍👧': '<i data-lucide="users"></i>',
    '🏫': '<i data-lucide="building"></i>',
    '👋': '',
    '📍': '<i data-lucide="map-pin"></i>',
    '⏳': '<i data-lucide="hourglass"></i>',
    '⚡': '<i data-lucide="zap"></i>',
    '🤖': '<i data-lucide="bot"></i>',
    '💬': '<i data-lucide="message-square"></i>',
    '📌': '<i data-lucide="pin"></i>',
    '📐': '<i data-lucide="pen-tool"></i>',
    '📖': '<i data-lucide="book-open"></i>',
    '🔬': '<i data-lucide="microscope"></i>',
    '💻': '<i data-lucide="monitor"></i>',
    '📊': '<i data-lucide="bar-chart-2"></i>',
    '🏪': '<i data-lucide="store"></i>',
    '📒': '<i data-lucide="book-marked"></i>',
    '🌍': '<i data-lucide="globe"></i>',
    '🏛': '<i data-lucide="landmark"></i>',
    '📜': '<i data-lucide="scroll"></i>',
    '🤝': '<i data-lucide="handshake"></i>',
    '🗣': '<i data-lucide="mic"></i>',
    '🥁': '<i data-lucide="music"></i>',
    '🌺': '<i data-lucide="flower"></i>',
    '🌟': '<i data-lucide="star"></i>',
    '🎯': '<i data-lucide="target"></i>'
}

# The regex matches any emoji
emoji_regex = re.compile(r'[\U0001F300-\U0001F9FF]|[\U00002600-\U000026FF]|[\U00002700-\U000027BF]|\U0001F1F3\U0001F1EC|\U0001F468\u200D\U0001F469\u200D\U0001F467|\U0001F469\u200D\U0001F3EB|[\u200D\uFE0F]')

for file_name in FILES:
    filepath = os.path.join(r"c:\Users\Fr Norbert\Desktop\examedge", file_name)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_emoji(match):
        char = match.group(0)
        # Try to find exactly, or default to empty string
        for k, v in EMOJI_TO_LUCIDE.items():
            if k in char:
                return v
        return ''

    # First replace exact known multi-char emojis
    for k, v in EMOJI_TO_LUCIDE.items():
        content = content.replace(k, v)

    # Then strip any remaining emojis
    content = emoji_regex.sub('', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Processed {file_name}")

print("Emoji replacement complete.")

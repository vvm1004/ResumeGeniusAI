

from textblob import TextBlob
def check_and_correct_spelling_with_positions(sentence):
    if isinstance(sentence, dict):
        sentence = ' '.join(str(value) for value in sentence.values())

    elif isinstance(sentence, list):
    
        sentence = ' '.join(str(value) for value in sentence)

    if not sentence:
        return '', {}

    blob = TextBlob(sentence)
    corrected_sentence = str(blob.correct())
    
    original_words = sentence.split()
    corrected_words = corrected_sentence.split()

    corrections = {}
    
    for index, (original, corrected) in enumerate(zip(original_words, corrected_words)):
        if original != corrected:
            corrections[index] = (original, corrected)

    return corrected_sentence, corrections

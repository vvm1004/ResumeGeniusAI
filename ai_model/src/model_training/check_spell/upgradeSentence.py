from .improveVocabulary import replace_with_stronger_words
from .improveLogic import process_text
from .edit1 import enhance_sentence
from .edit2 import improve_sentence




def upgrade_sentence(sentence):
    improved_sentence = replace_with_stronger_words(sentence)

    improved_sentence = improve_sentence(improved_sentence)

    improved_sentence = process_text(improved_sentence)

    improved_sentence = enhance_sentence(improved_sentence)

    return improved_sentence













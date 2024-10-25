def sort_sentences(sentences):
    return sorted(sentences)

def connect_ideas(sentences):
    connectors = [
        "Furthermore,", 
        "However,", 
        "In addition,", 
        "Moreover,", 
        "On the other hand,", 
        "Consequently,", 
        "Therefore,", 
        "As a result,", 
        "In contrast,"
    ]
    connected_text = ""
    
    for i, sentence in enumerate(sentences):
        connected_text += sentence.strip() + " "
        if i < len(sentences) - 1:
            connected_text += connectors[i % len(connectors)] + " "
    
    return connected_text.strip()

def process_text(text):
    sentences = text.split('.')
    sentences = [s for s in sentences if s.strip()]

    sorted_sentences = sort_sentences(sentences)

    coherent_text = connect_ideas(sorted_sentences)

    return coherent_text



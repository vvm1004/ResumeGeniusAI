from textblob import TextBlob
import language_tool_python
import requests
import re

# Ensure necessary NLTK data is downloaded

def enhance_sentence_rule_based(sentence):
    # Danh sách quy tắc thay thế mở rộng
    replacements = {
        r"\bresponsible for\b": "led",
        r"\bmanaging a team of\b": "leading",
        r"\boverseeing\b": "directing",
        r"\bdeveloped\b": "created",
        r"\bexecuted\b": "implemented",
        r"\bsuccessfully\b": "effectively",
        r"\bperformed\b": "achieved",
        r"\bin charge of\b": "managed",
        r"\bdirected\b": "oversaw",
        r"\bimplemented\b": "deployed",
        r"\bcoordinated\b": "orchestrated",
        r"\boptimized\b": "enhanced",
        r"\bimproved\b": "boosted",
        r"\butilized\b": "leveraged",
        r"\bdelivered\b": "completed",
        r"\bconducted\b": "executed",
        r"\bcreated\b": "designed",
        r"\banalyzed\b": "assessed",
        r"\bassisted\b": "supported",
        r"\bexecuted\b": "carried out",
        r"\bdelivered\b": "achieved",
        r"\bstreamlined\b": "simplified",
        r"\bmanaged\b": "oversaw",
        r"\bmonitored\b": "tracked",
        r"\bfacilitated\b": "coordinated",
        r"\bhandled\b": "addressed",
        r"\bimplemented\b": "introduced",
        r"\bled\b": "championed",
        r"\bexecuted\b": "administered",
        r"\bresolved\b": "solved",
        r"\bmonitored\b": "supervised",
        r"\bcreated\b": "developed",
        r"\bplanned\b": "strategized",
        r"\bcompleted\b": "finalized",
        r"\bdesigned\b": "crafted",
        r"\borganized\b": "arranged",
        r"\bdeveloped\b": "engineered",
        r"\btrained\b": "mentored",
        r"\bmaintained\b": "sustained",
        r"\bimplemented\b": "executed",
        r"\bexecuted\b": "carried out"
    }

    # Áp dụng các quy tắc thay thế vào câu
    improved_sentence = sentence
    for pattern, replacement in replacements.items():
        improved_sentence = re.sub(pattern, replacement, improved_sentence, flags=re.IGNORECASE)

    # Loại bỏ khoảng trắng thừa và làm sạch câu
    improved_sentence = ' '.join(improved_sentence.split())

    return improved_sentence


def improve_sentence_with_languagetool(sentence):
    url = 'https://api.languagetool.org/v2/check'
    data = {
        'text': sentence,
        'language': 'en-US'
    }
    response = requests.post(url, data=data).json()

    improved_sentence = sentence
    for match in response['matches']:
        replacement = match['replacements'][0]['value'] if match['replacements'] else ''
        if replacement:
            improved_sentence = improved_sentence.replace(match['context']['text'][match['offset']:match['offset'] + match['length']], replacement)

    return improved_sentence

def improve_sentence_with_language_tool(sentence):
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(sentence)
    improved_sentence = tool.correct(sentence)
    return improved_sentence

abbreviation_dict = {
    'Human Resources': 'HR',
    'Information Technology': 'IT',
    'Chief Executive Officer': 'CEO',
    'Chief Technology Officer': 'CTO',
    'Chief Financial Officer': 'CFO',
    'Chief Operating Officer': 'COO',
    'Vice President': 'VP',
    'Deputy General Manager': 'DGM',
    'Research and Development': 'R&D',
    'Not Applicable': 'N/A',
    'Project Manager': 'PM',
    'Customer Relationship Management': 'CRM',
    'Key Performance Indicator': 'KPI',
    'Return on Investment': 'ROI',
    'Software as a Service': 'SaaS',
    'Business to Business': 'B2B',
    'Business to Consumer': 'B2C',
    'Application Programming Interface': 'API',
    'User Interface': 'UI',
    'User Experience': 'UX',
    'HyperText Markup Language': 'HTML',
    'Cascading Style Sheets': 'CSS',
    'Structured Query Language': 'SQL',
    'Amazon Web Services': 'AWS',
    'Continuous Integration/Continuous Deployment': 'CI/CD',
    'Internet of Things': 'IoT',
    'Virtual Private Network': 'VPN',
    'Local Area Network': 'LAN',
    'Wide Area Network': 'WAN',
    'Generally Accepted Accounting Principles': 'GAAP',
    'Certified Public Accountant': 'CPA',
    'Profit and Loss': 'P&L',
    'Value Added Tax': 'VAT',
    'Accounts Payable': 'AP',
    'Accounts Receivable': 'AR',
    'Bill of Materials': 'BOM',
    'Bachelor of Arts': 'BA',
    'Bachelor of Science': 'BS',
    'Master of Arts': 'MA',
    'Master of Science': 'MS',
    'Master of Business Administration': 'MBA',
    'Doctor of Philosophy': 'PhD',
    'Grade Point Average': 'GPA',
    'Scholastic Assessment Test': 'SAT',
    'Graduate Record Examination': 'GRE',
    'Doctor of Medicine': 'MD',
    'Doctor of Osteopathic Medicine': 'DO',
    'Registered Nurse': 'RN',
    'Licensed Practical Nurse': 'LPN',
    'Certified Nursing Assistant': 'CNA',
    'Physical Therapist': 'PT',
    'Occupational Therapist': 'OT',
    'Emergency Medical Technician': 'EMT',
    'Intensive Care Unit': 'ICU',
    'Emergency Room': 'ER',
    'Juris Doctor': 'JD',
    'Bachelor of Laws': 'LLB',
    'Master of Laws': 'LLM',
    'Fiscal Year': 'FY',
    'Quarter 1': 'Q1',
    'Quarter 2': 'Q2',
    'Quarter 3': 'Q3',
    'Quarter 4': 'Q4',
    'Standard Operating Procedure': 'SOP',
    'Frequently Asked Questions': 'FAQ',
    'Request for Proposal': 'RFP',
    'Request for Quotation': 'RFQ',
    'To Be Announced': 'TBA',
    'To Be Determined': 'TBD'
}

def abbreviate_if_present(text):
    found_abbrs = set()
    for abbr in abbreviation_dict.values():
        if re.search(r'\b' + re.escape(abbr) + r'\b', text, re.IGNORECASE):
            found_abbrs.add(abbr)

    for full_form, abbr in abbreviation_dict.items():
        if abbr in found_abbrs:
            pattern = r'\b' + re.escape(full_form) + r'\b(?:\s*\(' + re.escape(abbr) + r'\))?'
            text = re.sub(pattern, abbr, text, flags=re.IGNORECASE)

    text = ' '.join(text.split())

    return text


original_sentence = (
    "'Increase annual sales to nearly $5.7 million through strategic marketing & sales campaigns.', 'Launched aggressive growth plans that helped increase customer base from 0 to 15,000 customers.', 'Created strategies to develop and expand existing customer sales, which resulted in a 200% sales growth in less than 12 months.', 'Grew a targeted newsletter subscriber list from 0 to 6,000 members in just 12 months.'"
)

# Ví dụ sử dụng
improved_sentence = enhance_sentence_rule_based(original_sentence)
improved_sentence = improve_sentence_with_language_tool(improved_sentence)
improved_sentence = improve_sentence_with_languagetool(improved_sentence)
improved_sentence = abbreviate_if_present(improved_sentence)

# Chuyển câu chủ động thành bị động (nếu phù hợp)

print("Original Sentence:", original_sentence)
print("Improved Sentence:", improved_sentence)

from django.shortcuts import render
from django.http import JsonResponse
from string import ascii_lowercase as lower
from string import ascii_uppercase as upper
from collections import Counter
import re


def main(request):
    return render(request, 'rotn/main.html')


def result_cipher(request):
    response_data ={}
    message = request.POST.get('message')
    message = remove_punct_marks(message)
    rot_number = int(request.POST.get('rot_number'))
    decode = bool(request.POST.get('decode'))
    freq_of_letters = freq(message.lower())
    response_data['result-text'] = rot_n(message, rot_number, reverse=decode)
    response_data['freq'] = freq_of_letters
    response_data['possible-answer'] = max(all_shifts(message))[1]
    return JsonResponse(response_data)


# Rotate Number function
def rot_n(msg, n, reverse=False):
    lower1 = str.maketrans(lower, lower[n:] + lower[:n])
    upper1 = str.maketrans(upper, upper[n:] + upper[:n])
    if reverse:
        lower1 = str.maketrans(lower[n:] + lower[:n], lower)
        upper1 = str.maketrans(upper[n:] + upper[:n], upper)
    return msg.translate(lower1).translate(upper1)

letter_statistic = dict(zip(upper,
                        [.0817,.0149,.0278,.0425,.1270,.0223,.0202,
                         .0609,.0697,.0015,.0077,.0402,.0241,.0675,
                         .0751,.0193,.0009,.0599,.0633,.0906,.0276,
                         .0098,.0236,.0015,.0197,.0007]))

variation_tables = [str.maketrans(upper, upper[i:]+upper[:i]) for i in range(26)]


def goodness(msg):
    return sum(letter_statistic.get(char, 0) for char in msg)


def all_shifts(msg):
    msg = msg.upper()
    for variation in variation_tables:
        txt = msg.translate(variation)
        yield goodness(txt), '{}{}'.format(txt[0], txt[1:].lower())


def freq(msg):
    data = []
    for c, n in sorted(Counter(msg.replace(' ', '')).items()):
        percent = round(n/len(msg), 4)
        data +=[[c, percent]]
    return sorted(data, key=lambda i : i[0])


def remove_punct_marks(msg):
    clear_text = re.sub(u'[^A-Za-z\s]*', u'', msg)
    return clear_text

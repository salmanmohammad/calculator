from django.shortcuts import render
from django.http import JsonResponse

def format_number(n):
    """Format number to int if it has no decimal part"""
    if isinstance(n, float) and n.is_integer():
        return int(n)
    return round(n, 2) if isinstance(n, float) else n


def calculator(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:

            # Check if the action is clear and clear the history
            if request.POST.get('action') == 'clear':
                request.session['history'] = []
                return JsonResponse({'result': '', 'history': []})
        
            num1 = float(request.POST.get('num1'))
            num2 = float(request.POST.get('num2'))
            operation = request.POST.get('operation')
            result = None
            
            if operation == 'add':
                result = num1 + num2
                op_symbol = '+'
            elif operation == 'subtract':
                result = num1 - num2
                op_symbol = '-'
            elif operation == 'multiply':
                result = num1 * num2
                op_symbol = '×'
            elif operation == 'divide':
                result = num1 / num2 if num2 != 0 else "Error: Divide by 0"
                op_symbol = '/'
            # print(result)
            # Format result
            if isinstance(result, (float)):
                result = round(result, 2)

            # ... operations as before

            # Format all numbers
            num1_fmt = format_number(num1)
            num2_fmt = format_number(num2)
            result_fmt = format_number(result)

            # Save in session
            history = request.session.get('history', [])
            history.insert(0, f"{num1_fmt} {op_symbol} {num2_fmt} = {result_fmt}")
            request.session['history'] = history[:10]

            return JsonResponse({'result': result, 'history': request.session.get('history', [])})
        except Exception:
            return JsonResponse({'result': 'Invalid input'}, status=400)

    return render(request, 'calculator/calculator.html', {
                'history': request.session.get('history', [])
            })

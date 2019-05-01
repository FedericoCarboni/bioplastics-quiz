import flask
import json
import os

app = flask.Flask(__name__)
langs = ('en-EU', 'it-IT')
results = []

with app.open_resource('static/dat/quiz.json') as f:
  quiz_json = json.load(f)


@app.route('/')
def index_redirect():
  return flask.redirect('/en-EU/')


@app.route('/<string:lang>/')
def index(lang):
  if not lang in langs:
    return flask.abort(404)
  return flask.render_template(lang + '/index.html')


@app.route('/<string:lang>/quiz/')
def quiz(lang):
  if quiz_json.get(lang) is None:
    return flask.abort(404)
  _quiz = quiz_json.get(lang)
  return flask.render_template('quiz.html', quiz=_quiz)


@app.route('/<string:lang>/quiz/result', methods=['GET', 'POST'])
def result(lang):
  if not lang in langs:
    return flask.abort(404)
  if flask.request.method == 'POST':
    average = sum(results) / len(results) if len(results) != 0 else 0
    result = flask.request.form.get('score')
    result = result if result is not None else flask.abort(400)
    result = float(result) if result.isdigit() else flask.abort(400)
    results.append(result)
    return flask.render_template(lang + '/result.html', result=result, average=average)
  else:
    return flask.redirect('/' + lang + '/quiz/')


if __name__ == '__main__':
  app.run(debug=True, port=80)

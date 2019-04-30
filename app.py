import flask

app = flask.Flask(__name__)


@app.route('/<string:lang>')
def index(lang):
    return flask.render_template(f'index.{lang}.html')


@app.route('/<string:lang>/quiz', methods=['GET', 'POST'])
def quiz(lang):
    print(flask.request.method)
    return flask.render_template(f'quiz.{lang}.html')


if __name__ == '__main__':
    app.run(debug=True, port=80)


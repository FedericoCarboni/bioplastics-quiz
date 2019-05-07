import datetime
import json

import flask
from flask_sqlalchemy import SQLAlchemy


app = flask.Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///results.db'

db = SQLAlchemy(app)

with app.open_resource('static/dat/quiz.json') as f:
    quiz_json = json.load(f)

class Result(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Float, nullable=False)
    time = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"Result(score={self.score}, time='{self.time}')"
    
    def __radd__(self, other):
        return self.score + other


langs = ('en', 'it')


@app.route('/')
def index_redirect():
    return flask.redirect('/' + langs[0])


@app.route('/<string:lang>/')
def index(lang: str):
    if lang not in langs:
        return flask.abort(404)
    return flask.render_template(f'{lang}/index.min.html')


@app.route('/<string:lang>/quiz/')
def quiz(lang: str):
    if lang not in langs:
        return flask.abort(404)
    return flask.render_template(f'{lang}/quiz.min.html', quiz=quiz_json[lang])


@app.route('/<string:lang>/quiz/result/', methods=['GET', 'POST'])
def result(lang: str):
    if lang not in langs:
        return flask.abort(404)
    if flask.request.method == 'POST':
        results = Result.query.all()
        average = sum(results) / len(results) if len(results) != 0 else 0
        score = flask.request.form.get('score')
        score = score if score is not None else flask.abort(400)
        score = float(score) if score.isdigit() else flask.abort(400)
        db.session.add(Result(score=score, time=datetime.datetime.utcnow().strftime('%d/%m/%Y')))
        db.session.commit()
        tmp = []
        chart_data = {}
        chart_data['labels'] = []
        chart_data['datasets'] = []
        for result in results:
            if result.time not in chart_data['labels']:
                delta = datetime.datetime.utcnow() - datetime.datetime.strptime(result.time, '%d/%m/%Y') 
                if delta < datetime.timedelta(days=120):
                    chart_data['labels'].append(result.time)
        data = []
        for time in chart_data['labels']:
            temp = []
            for item in results:
                if item.time == time:
                    temp.append(item)
            avg = sum(temp) / len(temp) if len(temp) != 0 else -1
            if avg != -1:
                data.append(avg)
        chart_data['datasets'].append({'label': 'Average per day' if lang == 'en' else 'Media giornaliera', 'data': data, 'borderColor': '#007bff'})

        return flask.render_template(f'{lang}/result.min.html', score=score, average=average, chart_data=chart_data)
    else:
        return flask.redirect(f'/{lang}/quiz/')

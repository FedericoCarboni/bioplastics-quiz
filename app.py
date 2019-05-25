import functools
import datetime
import secrets
import json

import flask
from flask_sqlalchemy import SQLAlchemy
import jinja2
import jwt


@jinja2.evalcontextfilter
def json_dumps(eval_ctx, value, **kwargs):
    policies = eval_ctx.environment.policies
    options = kwargs if kwargs else {
        'skipkeys': False, 
        'ensure_ascii': True, 
        'check_circular': True, 
        'allow_nan': False, 
        'sort_keys': True, 
        'indent': None, 
        'separators': (',', ':'), 
        'default': None,
    }
    return jinja2.filters.htmlsafe_json_dumps(value, dumper=json.dumps, **options)


app = flask.Flask(__name__)
app.jinja_env.filters['tojson'] = json_dumps
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///results.db'
app.config['SECRET_KEY'] = secrets.token_hex(32)

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


langs = list(quiz_json.keys())


@app.route('/')
def index_redirect():
    return flask.redirect('/' + langs[0] + '/')


@app.route('/<string:lang>/')
def index(lang: str):
    if lang not in langs:
        return flask.abort(404)
    return flask.render_template(f'{lang}/index.min.html')


@app.route('/<string:lang>/quiz/')
def quiz(lang: str):
    if lang not in langs:
        return flask.abort(404)
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=4)
    }
    token = jwt.encode(payload, key=app.config['SECRET_KEY'])
    return flask.render_template(f'{lang}/quiz.min.html', quiz=quiz_json[lang], token=token.decode('utf-8'))


@app.route('/<string:lang>/quiz/result/', methods=['GET', 'POST'])
def result(lang: str):
    if lang not in langs:
        return flask.abort(404)
    if flask.request.method == 'POST':
        try:
            tok_payload = jwt.decode(flask.request.form.get('token').encode(), key=app.config['SECRET_KEY'])
        except jwt.ExpiredSignatureError as e:
            return flask.abort(401)
        except jwt.InvalidTokenError as e:
            return flask.abort(404)
        results = Result.query.all()
        average = int(sum(results) / len(results)) if len(results) != 0 else 0
        score = flask.request.form.get('score')
        score = score if score is not None else flask.abort(400)
        score = int(score) if score.isdigit() else flask.abort(400)
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
            print(temp)
            avg = int(sum(temp) / len(temp)) if len(temp) != 0 else -1
            print(avg)
            if avg != -1:
                data.append(avg)
        chart_data['datasets'].append({'label': quiz_json[lang]['lang']['averageperday'], 'data': data, 'borderColor': '#007bff'})
        lang_data = quiz_json[lang]['lang']
        if score > average:
            description = lang_data['resultaboveaverage'] % {'score': score, 'average': average}
        else:
            description = lang_data['resultunderaverage'] % {'score': score, 'average': average}
        if score < 60:
            description += lang_data['resultunder60']
        elif 60 <= score < 80:
            description += lang_data['resultunder80']
        else:
            description += lang_data['resultabove80']
        return flask.render_template(f'{lang}/result.min.html', description=description, score=score, average=average, chart_data=chart_data)
    else:
        return flask.redirect(f'/{lang}/quiz/')

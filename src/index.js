const moodleString = require('./xmlStrings');

const availExercises = ['category', 'multichoice', 'essay', 'shortanswer', 'truefalse', 'description', 'cloze', 'numerical', 'matching', 'order'];
const answerRegex = new RegExp(/^\s*answer:\s*/i);
const gfeedRegex = new RegExp(/^\s*gfeed\.\s*/i);
const matchRegex = new RegExp(/^\s*match:?\s*/i);
const feedbackRegex = new RegExp(/^\s*feedback:\s*/i);
const letterRegex = new RegExp(/^\s*(\w)(:?\.|\))\s*/);
const addNSNC = (question, options) => {
  if (options.nsnc) {
    question.answers.push(options.lang === 'es' ? 'NS/NC' : 'n/a');
  }
  if (options.penalty) {
    question.fractions.push(0);
  }
};
const escapeHtml = unsafe => unsafe
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');
// eslint-disable-next-line no-extend-native
String.prototype.escapeCode = function () {
  return this.replace(/<pre>(.+?)<\/pre>/gism, (_a, str) => `<pre>${escapeHtml(str)}</pre>`)
    .replace(/<code>(.+?)<\/code>/gism, (_a, str) => `<code>${escapeHtml(str)}</code>`);
};
const aikenToMoodleXML = (contents, callback, options = {}) => {
  const splitExercises = contents.split(/\n\s*\n/);
  try {
    callback(moodleString(splitExercises.map((exercise) => {
      const question = {
        type: 'multichoice',
        question: ''
      };
      const lines = exercise.split(/\n+/);
      const firstLine = lines[0].replace(/\s/, '');
      const exerciseIndex = availExercises.indexOf(firstLine);
      let questionIndex = 1;
      [question.question] = lines;
      if (exerciseIndex !== -1) {
        question.type = availExercises[exerciseIndex];
        questionIndex = 2;
        [, question.question] = lines;
      }

      question.question = question.question ? question.question.replace(/\r/, '') : '';
      if (question.type === 'category') {
        question.categories = [question.question];
      }
      for (let i = questionIndex; i < lines.length; i += 1) {
        if (question.type === 'category') {
          question.categories.push(lines[i]);
        } else if (answerRegex.test(lines[i])) {
          question.correctAnswer = lines[i]
            .replace(answerRegex, '')
            .replace('\r', '')
            .split(',')
            .map((r) => {
              try {
                return typeof r === 'string' ? JSON.parse(r.toLowerCase()) : JSON.parse(r);
              } catch (e) {
                return r;
              }
            });
          if (question.type === 'multichoice') {
            question.single = question.correctAnswer.length === 1;
            question.correctAnswer = question.correctAnswer.map((r) => {
              try {
                if (Number.isNaN(Number(r)) && Boolean(r) !== r) {
                  return r.replace(/\s/g, '').toLowerCase().charCodeAt(0) - 97;
                } else if (!Number.isNaN(Number(r))) {
                  return r - 1;
                }
                return r;
              } catch (e) {
                return r;
              }
            });
          }
        } else if (letterRegex.test(lines[i])) {
          question.answers = [...(question.answers || []), lines[i].replace(letterRegex, '').replace('\r', '').escapeCode()];
          const match = lines[i].match(letterRegex);
          if (question.type === 'multichoice') {
            question.useLetters = question.useLetters ||
              (match && match.length && Number.isNaN(Number(match[1])));
          }
        } else if (gfeedRegex.test(lines[i])) {
          question.feedback = lines[i].replace(gfeedRegex, '').replace('\r', '').escapeCode();
        } else if (feedbackRegex.test(lines[i])) {
          question.feedback = lines[i].replace(feedbackRegex, '').replace('\r', '').escapeCode();
        } else if (matchRegex.test(lines[i])) {
          question.correctAnswer = [...(question.correctAnswer || []), lines[i].replace(matchRegex, '').replace('\r', '').escapeCode()];
        } else {
          question.question += `\n${lines[i]}`;
        }
      }
      question.question = question.question && typeof question.question === 'string' ? question.question.escapeCode() : question.question;
      if (question.type === 'shortanswer' || question.type === 'numerical') {
        // eslint-disable-next-line  no-confusing-arrow
        question.answers = (question.correctAnswer || []).map(e => (e && typeof e === 'string') ? e.replace(/^(\s)*/, '') : e);
        question.correctAnswer = (question.correctAnswer || []).map((a, i) => i);
      } else if (question.type === 'multichoice') {
        if (options.penalty) {
          question.fractions = question.answers.map((_a, j) => {
            if (question.correctAnswer.indexOf(j) === -1) {
              return -Math.round(10000 / (question.answers.length - 1)) / 100;
            }
            return Math.round(10000 / question.correctAnswer.length) / 100;
          });
        }
        if (question.single) {
          addNSNC(question, options);
        }
      } else if (question.type === 'truefalse') {
        question.type = 'multichoice';
        question.answers = [options.lang !== 'es' ? 'True' : 'Verdadero', options.lang !== 'es' ? 'False' : 'Falso'];
        const correctAnswerExists = question.correctAnswer && question.correctAnswer.length;
        question.correctAnswer = (correctAnswerExists && question.correctAnswer[0]) ? [0] : [1];
        if (options.penalty) {
          question.fractions = (correctAnswerExists && question.correctAnswer[0]) ?
            [100, -100] : [-100, 100];
        }
        addNSNC(question, options);
      }
      return question;
    }), options));
  } catch (e) {
    callback(undefined, e);
  }
};


export default aikenToMoodleXML;

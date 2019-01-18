const moodleString = require('./xmlStrings');

const availExercises = ['multichoice', 'essay', 'shortanswer', 'truefalse', 'description', 'cloze', 'numerical', 'matching', 'order'];
const answerRegex = new RegExp(/^\s*Answer:\s*/);
const gfeedRegex = new RegExp(/^\s*gfeed\.\s*/);
const matchRegex = new RegExp(/^\s*match:?\s*/);
const feedbackRegex = new RegExp(/^\s*Feedback:\s*/);
const letterRegex = new RegExp(/^\s*(\w)\.\s*/);

const aikenToMoodleXML = (contents, callback) => {
  const splitExercises = contents.split(/\n\s*\n/);
  try {
    callback(moodleString(splitExercises.map((exercise) => {
      const question = {
        type: 'multichoice',
        question: ''
      };
      const lines = exercise.split(/\n/);
      const firstLine = lines[0].replace(/\s/, '');
      const exerciseIndex = availExercises.indexOf(firstLine);
      let questionIndex = 1;
      [question.question] = lines;
      if (exerciseIndex !== -1) {
        question.type = availExercises[exerciseIndex];
        questionIndex = 2;
        [, question.question] = lines;
      }
      question.question = question.question.replace(/\r/, '');
      for (let i = questionIndex; i < lines.length; i += 1) {
        if (answerRegex.test(lines[i])) {
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
                if (Number.isNaN(Number(r)) && !!r !== r) {
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
          question.answers = [...(question.answers || []), lines[i].replace(letterRegex, '').replace('\r', '')];
          const match = lines[i].match(letterRegex);
          if (question.type === 'multichoice') {
            question.useLetters = question.useLetters ||
              (match && match.length && Number.isNaN(Number(match[1])));
          }
        } else if (gfeedRegex.test(lines[i])) {
          question.feedback = lines[i].replace(gfeedRegex, '').replace('\r', '');
        } else if (feedbackRegex.test(lines[i])) {
          question.feedback = lines[i].replace(feedbackRegex, '').replace('\r', '');
        } else if (matchRegex.test(lines[i])) {
          question.correctAnswer = [...(question.correctAnswer || []), lines[i].replace(matchRegex, '').replace('\r', '')];
        }
      }
      if (question.type === 'shortanswer' || question.type === 'numerical') {
        // eslint-disable-next-line  no-confusing-arrow
        question.answers = question.correctAnswer.map(e => (e && typeof e === 'string') ? e.replace(/^(\s)*/, '') : e);
        question.correctAnswer = (question.correctAnswer || []).map((a, i) => i);
      } else if (question.type === 'truefalse') {
        question.answers = ['True', 'False'];
        question.correctAnswer = question.correctAnswer && question.correctAnswer[0] ? [0] : [1];
      }
      return question;
    })));
  } catch (e) {
    callback(undefined, e);
  }
};
export default aikenToMoodleXML;

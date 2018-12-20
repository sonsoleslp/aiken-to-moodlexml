const availExercises = ['multichoice', 'essay', 'shortanswer', 'truefalse', 'description', 'cloze', 'numerical', 'matching', 'order'];

const aikenToMoodleXML = (contents, callback) => {
  const splitExercises = contents.split(/\n\s*\n/);
  try {
    callback(splitExercises.map((exercise) => {
      const question = {
        type: 'multichoice',
        question: ''
      };
      const lines = exercise.split(/\n/);
      const firstLine = lines[0].replace(/\s/, '');
      const exerciseIndex = availExercises.indexOf(firstLine);
      [question.question] = lines;
      if (exerciseIndex !== -1) {
        question.type = availExercises[exerciseIndex];
        [, question.question] = lines;
      }
      question.question = question.question.replace(/\r/, '');
      switch (question.type) {
        case 'multichoice':
          break;
        case 'essay':
          break;
        case 'shortanswer':
          break;
        case 'truefalse':
          break;
        case 'description':
          break;
        case 'cloze':
          break;
        case 'numerical':
          break;
        case 'matching':
          break;
        case 'order':
          break;
        default:
          break;
      }
      return question;
    }));
  } catch (e) {
    callback(undefined, e);
  }
};
export default aikenToMoodleXML;

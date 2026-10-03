export type Q={id:number,part:string,instruction:string,text:string,options:string[],answer:string,feedback:string};

const P:Record<number,[string,string]>={
  1:['Part 1 — Relative Words','Choose the best answer.'],
  2:['Part 2 — Defining vs. Non-defining','Choose the sentence that best matches the meaning.'],
  3:['Part 3 — Subject, Object, or Possessive?','Choose the best relative structure.'],
  4:['Part 4 — Can You Drop the Pronoun?','Choose DROP if the pronoun can be omitted. Choose KEEP if it cannot.'],
  5:['Part 5 — Where, When, Why','Choose the option that matches the noun’s function.'],
  6:['Part 6 — Everyday Error Clinic','Choose the correctly rewritten sentence.']
};

const part=(id:number)=>id<=5?1:id<=10?2:id<=15?3:id<=20?4:id<=25?5:6;
const make=(id:number,text:string,options:string[],answer:string,feedback:string):Q=>{
  const n=part(id);
  return{id,part:P[n][0],instruction:P[n][1],text,options,answer,feedback};
};

export const questions:Q[]=[
  make(1,'The neighbor ___ owns the dog is moving next month.',['which','who','where','whose'],'who','Use who for a person who does the action.'),
  make(2,'I lost the charger ___ came with my phone.',['who','where','that','when'],'that','Use that or which for a thing.'),
  make(3,'That is the café ___ we usually study after class.',['where','which','whose','why'],'where','The café is the location where the action happens.'),
  make(4,'Friday is the day ___ I usually work from home.',['where','when','which','whose'],'when','Use when for a time expression.'),
  make(5,'That is the reason ___ I called you last night.',['where','whose','why','who'],'why','Why commonly follows reason.'),

  make(6,'Your listener does not know which coworkers you mean. Which sentence is best?',['The coworkers, who finished early, are coming.','The coworkers who finished early are coming.','The coworkers, that finished early, are coming.'],'The coworkers who finished early are coming.','Use a defining clause because the information identifies which coworkers.'),
  make(7,'You have one brother, and your listener already knows who he is. Which sentence is best?',['My brother who lives in Canada is a software engineer.','My brother, who lives in Canada, is a software engineer.','My brother, that lives in Canada, is a software engineer.'],'My brother, who lives in Canada, is a software engineer.','Use a non-defining clause for extra information about an already identified person.'),
  make(8,'Which sentence means that only the students who passed may leave?',['The students, who passed, can leave.','The students who passed can leave.','The students, that passed, can leave.'],'The students who passed can leave.','No commas: the clause identifies a subgroup.'),
  make(9,'Which sentence means that all of the speaker’s friends live nearby?',['My friends who live nearby visit often.','My friends, who live nearby, visit often.','My friends that live nearby, visit often.'],'My friends, who live nearby, visit often.','Commas show the clause is extra information about the whole known group.'),
  make(10,'Which sentence correctly uses a non-defining clause?',['My laptop, that I bought last year, is already slow.','My laptop, which I bought last year, is already slow.','My laptop which, I bought last year, is already slow.'],'My laptop, which I bought last year, is already slow.','Use commas and which, not that, in this non-defining clause.'),

  make(11,'The driver ___ called me is outside.',['who','whom','whose','where'],'who','The driver does the action: subject relative.'),
  make(12,'The driver ___ I called is outside.',['where','whose','who','when'],'who','The driver receives the action: object relative.'),
  make(13,'The driver ___ car broke down is outside.',['who','which','whose','whom'],'whose','Whose expresses possession: the driver’s car.'),
  make(14,'I know a mechanic ___ fixes motorcycles.',['who','whom','whose','where'],'who','The mechanic does the fixing, so the pronoun is the subject.'),
  make(15,'The restaurant ___ my sister recommended was great.',['where','that','whose','who'],'that','My sister recommended the restaurant, so the restaurant is the object.'),

  make(16,'Can the pronoun be dropped? The friend WHO recommended this app knows me well.',['DROP','KEEP'],'KEEP','Who is the subject of recommended.'),
  make(17,'Can the pronoun be dropped? The movie THAT you recommended was great.',['DROP','KEEP'],'DROP','That is the object, so it can be omitted in this defining clause.'),
  make(18,'Can the pronoun be dropped? The restaurant WHICH we tried was packed.',['DROP','KEEP'],'DROP','Which is the object in a defining clause.'),
  make(19,'Can the pronoun be dropped? My aunt, WHO you met last year, is visiting.',['DROP','KEEP'],'KEEP','Do not omit the relative pronoun in a non-defining clause.'),
  make(20,'Can the pronoun be dropped? The neighbor WHO plays loud music lives upstairs.',['DROP','KEEP'],'KEEP','Who is the subject of plays.'),

  make(21,'Choose the best sentence.',['The café where I study is quiet.','The café which I study is quiet.','The café when I study is quiet.'],'The café where I study is quiet.','The café is the location of the action.'),
  make(22,'Choose the best sentence.',['The café where I renovated is quiet.','The café that I renovated is quiet.','The café when I renovated is quiet.'],'The café that I renovated is quiet.','The café is the object of renovated, so use that or which.'),
  make(23,'Choose the best sentence.',['The year when I graduated changed my life.','The year where I graduated changed my life.','The year who I graduated changed my life.'],'The year when I graduated changed my life.','The year functions as a time expression.'),
  make(24,'Choose the best sentence.',['The house where my parents sold was old.','The house that my parents sold was old.','The house when my parents sold was old.'],'The house that my parents sold was old.','My parents sold the house, so house is the object.'),
  make(25,'Choose the best sentence.',['The reason why I left early was traffic.','The reason where I left early was traffic.','The reason who I left early was traffic.'],'The reason why I left early was traffic.','Why commonly follows reason.'),

  make(26,'Choose the correct sentence.',['The girl which works with me is funny.','The girl who works with me is funny.','The girl whose works with me is funny.'],'The girl who works with me is funny.','Use who for a person as subject.'),
  make(27,'Choose the correct sentence.',['My phone, that I bought last month, is broken.','My phone, which I bought last month, is broken.','My phone which, I bought last month is broken.'],'My phone, which I bought last month, is broken.','Use which, not that, in a non-defining clause.'),
  make(28,'Choose the correct sentence.',['The guy who I called him never answered.','The guy who I called never answered.','The guy which I called never answered.'],'The guy who I called never answered.','Do not repeat the object with him.'),
  make(29,'Choose the correct sentence.',['The place where I visited was beautiful.','The place that I visited was beautiful.','The place when I visited was beautiful.'],'The place that I visited was beautiful.','The place is the object of visited, so use that or which.'),
  make(30,'Choose the correct sentence.',['The student whose phone rang apologized.','The student who phone rang apologized.','The student whom phone rang apologized.'],'The student whose phone rang apologized.','Whose connects the student to the phone they have.')
];

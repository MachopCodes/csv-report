import { timeStamp } from 'console';

const fs = require('fs')
const util = require('util')

export default (req, res) => {
    // Map Students: [ [0]id, [1]name ] then map Marks: [ [0]test_id, [1]student_id, [2]mark ] (store the mark)
    // If student_id on the mark matches the student, map Tests: [ [0]test_id, [1] course_id, [2] weight ]
    // if the test_id matches the test on the grade, map Courses: [ [0]course_id, [1]name, [2]teacher ]
    // check if courses[] includes this course yet
    const readFile = util.promisify(fs.readFile)
    Promise.all([
        readFile('./public/marks.csv'), 
        readFile('./public/tests.csv'), 
        readFile('./public/courses.csv'), 
        readFile('./public/students.csv')
    ])
        .then((data) => {
            let split = (s) => s.toString().split('\n')
            const [marks, tests, courses, students] = data,
            markdata = split(marks).map(m => m.replace('\r', '')),
            testdata = split(tests), coursedata = split(courses), studentdata = split(students),
            object = { students: [] }
            markdata.shift(); testdata.shift(); coursedata.shift(); studentdata.shift()
            split = (string) => string.split(',')
            studentdata.map(student => {
                const sCourses = []
                markdata.map(mark => {
                    split(mark)[1] === split(student)[0] && testdata.map(test => {
                        split(test)[0] === split(mark)[0] && coursedata.map(course => {
                            const courseIndex = sCourses.findIndex(c => { return c.id === course[0] })
                            if (split(course)[0] === split(test)[1]) {
                                const wMark = Math.round(split(mark)[2] * split(test)[2] /100)
                                courseIndex === -1 
                                    ? sCourses.push({
                                        id: split(course)[0],
                                        name: split(course)[1],
                                        teacher: split(course)[2],
                                        courseAverage: wMark
                                    })
                                    : sCourses[courseIndex].courseAverage += wMark
                                }
                            }) 
                        })
                    })
                    const sum = sCourses.reduce((r,a) => { return r + a.courseAverage }, 0)
                    const totalAverage = Number((sum / sCourses.length).toFixed(2))
                object.students.push({ id: Number(split(student)[0]), name: split(student)[1], totalAverage, courses: sCourses })
            })
            return res.status(200).json(object)
        })
        .catch(err => console.log(err)) 
};
  
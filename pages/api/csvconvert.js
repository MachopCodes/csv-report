const fs = require('fs')
const util = require('util')

// const object = {
    // students: [
        // studentObject
        // id: 1
        // name: A
        // totalAvg: 90
        // courses: [
            // courseObject
            // id: 1
            // name: bio
            // teacher: buckley
            // courseavg: 90
        // ]
    // ]
// }
export default (req, res) => {
    const readFile = util.promisify(fs.readFile)
    Promise.all([
        readFile('./public/marks.csv'), 
        readFile('./public/tests.csv'), 
        readFile('./public/courses.csv'), 
        readFile('./public/students.csv')
    ])
        .then((data) => {
            const [marks, tests, courseObj, students] = data
            const markArray = marks.toString().split('\n').map(m => m.replace('\r', ''))
            const testArray = tests.toString().split('\n')
            const courseArray = courseObj.toString().split('\n')
            const studentArray = students.toString().split('\n')
            const object = {
                students: []
            }
            studentArray.shift()
            studentArray.map(student => {
                const s = student.split(',')
                console.log('inside student', student[0])
                const courses = []
                let totalAverage = 0
                markArray.map(mark => {
                    // 0 test_id, 1 student_id, 2 mark
                    // first find the student who got this grade
                    // if mark student.id matches the student student.id
                    // map through the test array
                    const m = mark.split(',')
                    if (m[1] === s[0]) testArray.map(test => {
                            // 0 id, 1 course_id, 2 weight
                            // next find the test that matches this test
                            // if the mark test.id matches the test test.id
                            // find the courses this student takes
                            const t = test.split(',')
                            if (m[0] === t[0]) {
                                courseArray.map(course => {
                                    // 0 id, 1 name, 2 teacher
                                    // if the test course.id matches the course course.id
                                    const c = course.split(',')
                                    if (t[1] === c[0]) {
                                        // if the object doesnt exist yet
                                        // if (courses.includes(something)) 
                                        courses.push({
                                            id: c[0],
                                            name: c[1],
                                            teacher: c[2],
                                            courseavg: m[2]*t[2]/100
                                        })
                                        // id: 1
                                        // name: bio
                                        // teacher: buckley
                                        // courseavg: 90
                                    }
                                })

                            }  
                        })
                    })
                    object.students.push({ id: s[0], name: s[1], totalAverage })
                })
                console.log('object', object)
            // markArray.map(m => {
            //     const mark = m.split(',')
            //     const studentMarks = mark.filter(m => m[1] === student[0])
            //     console.log(studentMarks)
            // })
            return res.status(200).json(data).toString()
        })  
};
  
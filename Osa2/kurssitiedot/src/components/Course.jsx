const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  }

  const Header = ({course}) => {
    return (
        <h1>{course.name}</h1>
    )
  }
  
  const Part = ({part}) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => (
          <Part key={part.id} part={part} />
        ))}
      </div>
    )
  }
  
  const Total = ({course}) => {
    const result = course.parts.map(part => part.exercises)
    const sum = result.reduce(
    (s, p) => s + p
  )
  
    return (
      <p> <b>total of {sum} exercises </b></p>
    )
  }
export default Course
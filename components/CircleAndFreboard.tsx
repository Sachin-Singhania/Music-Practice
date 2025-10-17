import { CircleOfFifth } from "./Circleoffifth"
import { GuitarFretboard } from "./GuitarFretBoard"
import { MyKeySelectorForGuitarFretboardProvider } from "./Music-provider"

export const CircleAndFretBoard=()=>{
  return (
     <MyKeySelectorForGuitarFretboardProvider>
      <CircleOfFifth />
      <GuitarFretboard />
     </MyKeySelectorForGuitarFretboardProvider>
  )
}
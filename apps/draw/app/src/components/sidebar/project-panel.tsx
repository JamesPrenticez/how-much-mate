import { AutoComplete } from "@shared/components"
import { useState } from "react"
import { Search } from 'lucide-react';

const exampleOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

export const ProjectPanel = () => {
  const [selectedProject, setSelectedProject] = useState("")

  return (
      <AutoComplete
        value={selectedProject}
        onChange={setSelectedProject}
        options={exampleOptions}
        placeholder="Select a Project"
        renderIcon={<Search size={16} />}
      />
  )
}


import { AutoComplete } from '@shared/components';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useProjectStore } from '@draw/stores';

export const ProjectPanel = () => {
  const { projects, activeProject } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(
    function setLastProjectUserWorkedOn() {
      if (activeProject) {
        setSelectedProject(`${activeProject.code} - ${activeProject.name}`);
      }
    },
    [activeProject]
  );

  const options = projects.map((project) => ({
    label: `${project.code} - ${project.name}`,
    value: `${project.code} - ${project.name}`,
  }));

  return (
    <AutoComplete
      value={selectedProject}
      onChange={setSelectedProject}
      options={options}
      placeholder="Select a Project"
      renderIcon={<Search size={16} />}
    />
  );
};

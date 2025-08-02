import { AutoComplete } from '@shared/components';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useProjectStore } from '@draw/stores';

export const ProjectPanel = () => {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(
    function setLastProjectUserWorkedOn() {
      if (projects && projects.length > 0) {
        setSelectedProject(`${projects[0].code} - ${projects[0].name}`);
      }
    },
    [projects]
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

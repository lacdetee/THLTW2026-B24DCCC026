import Bai1 from './components/Bai1';
import Bai2 from './components/Bai2';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';

const App = () => {
  const [selectedKey, setSelectedKey] = useState<string>('');

  const items: MenuProps['items'] = [
    { label: 'Bài 1', key: 'Bai1' },
    { label: 'Bài 2', key: 'Bai2' },
  ];

  return (
    <div>
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={(e) => setSelectedKey(e.key)}
        items={items}
      />

      <div style={{ marginTop: 20 }}>
        {selectedKey === 'Bai1' && <Bai1 />}
        {selectedKey === 'Bai2' && <Bai2 />}
      </div>
    </div>
  );
};

export default App;
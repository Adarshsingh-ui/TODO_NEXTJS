import moment, { Moment as MomentType } from 'moment';
import Head from 'next/head'
import { SyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaTrash } from 'react-icons/fa';

interface Item {
  id: number;
  description: string;
  date: MomentType;
}

export default function Index() {
  const [item, setItem] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [currentId, setCurrentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = localStorage.getItem("todo-items");
    const currentId = localStorage.getItem("todo-current-id");

    if (items === null || items.length === 0) {
      setLoading(false);
      return;
    }
    setCurrentId(currentId !== null ? parseInt(currentId) : 0);
    setAllItems(JSON.parse(items));
    setLoading(false);
  }, []);

  const add = (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading || !item.trim()) return;
    const items = [...allItems];
    items.push({
      id: currentId + 1,
      description: item.trim(),
      date: moment()
    });

    localStorage.setItem('todo-items', JSON.stringify(items));
    localStorage.setItem('todo-current-id', `${currentId + 1}`);

    setCurrentId(currentId + 1);
    setAllItems(items);
    setItem("");
  }

  const remove = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    if (loading) return;
    const items = [...allItems];

    let index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    setAllItems(items);

    localStorage.setItem('todo-items', JSON.stringify(items));
  }

  return (
    <>
      <Head>
        <title>To-do List App!</title>
        <meta name="description" content="A simple and elegant todo list application" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">To-Do List</h1>
          
          <form className='w-full md:w-1/2 lg:w-1/3 mx-auto mb-8' onSubmit={add}>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg py-2 px-4 outline-none border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400 transition-colors shadow-sm"
                placeholder='Add a new task...'
                onChange={(e) => setItem(e.target.value)}
                value={item}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition flex items-center gap-2"
                type="submit"
                disabled={loading || !item.trim()}
              >
                <FaPlus />
                Add
              </button>
            </div>
          </form>

          <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Tasks</h3>
            
            {allItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                {allItems.map(item => (
                  <div key={uuidv4()} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <span className="text-gray-700">{item.description}</span>
                    <button 
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      onClick={(e) => remove(e, item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

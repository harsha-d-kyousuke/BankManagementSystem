
import React, { useState, FormEvent } from 'react';
import { FoodItem, MealType } from '../types';
import { MEAL_TYPES } from '../constants';
import { PlusIcon, SearchIcon } from './Icons';
import Loader from './Loader';

interface FoodSearchProps {
  onSearch: (query: string) => void;
  results: FoodItem[];
  onLogFood: (food: FoodItem, mealType: MealType) => void;
  isLoading: boolean;
  error: string | null;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onSearch, results, onLogFood, isLoading, error }) => {
  const [query, setQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>(MealType.Breakfast);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Search Food</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 1 large apple"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            disabled={isLoading}
          />
           <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600"
                disabled={isLoading}
                aria-label="Search"
            >
                <SearchIcon />
            </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Find Food'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

      {results.length > 0 && (
        <div className="mt-6 flex-grow">
          <h3 className="font-semibold text-slate-700">Results</h3>
          <p className="text-xs text-slate-500 mb-2">Nutritional values are per 100g.</p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {results.map((item, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.calories} kcal &bull; P:{item.protein}g &bull; C:{item.carbohydrates}g &bull; F:{item.fat}g
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMeal}
                    onChange={(e) => setSelectedMeal(e.target.value as MealType)}
                    className="text-xs border-slate-300 rounded-md py-1 pl-2 pr-7 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {MEAL_TYPES.map((meal) => (
                      <option key={meal} value={meal}>
                        {meal}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onLogFood(item, selectedMeal)}
                    className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label={`Log ${item.name}`}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;

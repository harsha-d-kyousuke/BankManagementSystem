
import React from 'react';
import { LoggedFood } from '../types';
import { MEAL_TYPES } from '../constants';
import { TrashIcon } from './Icons';

interface MealLoggerProps {
  loggedFoods: LoggedFood[];
  onRemoveFood: (foodId: string) => void;
}

const MealCard: React.FC<{
  title: string;
  foods: LoggedFood[];
  onRemoveFood: (foodId: string) => void;
}> = ({ title, foods, onRemoveFood }) => {
  const totalCalories = Math.round(foods.reduce((sum, food) => sum + food.calories, 0));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm font-medium text-slate-500">{totalCalories} kcal</p>
      </div>
      <div className="space-y-3">
        {foods.length > 0 ? (
          foods.map((food) => (
            <div key={food.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <div>
                <p className="font-semibold text-slate-800">{food.name}</p>
                <p className="text-xs text-slate-500">
                  {food.calories} kcal &bull; P:{food.protein}g &bull; C:{food.carbohydrates}g &bull; F:{food.fat}g
                </p>
              </div>
              <button
                onClick={() => onRemoveFood(food.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded-full transition-colors"
                aria-label={`Remove ${food.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No items logged for this meal.</p>
        )}
      </div>
    </div>
  );
};

const MealLogger: React.FC<MealLoggerProps> = ({ loggedFoods, onRemoveFood }) => {
  return (
    <div className="space-y-6">
      {MEAL_TYPES.map((mealType) => (
        <MealCard
          key={mealType}
          title={mealType}
          foods={loggedFoods.filter((food) => food.mealType === mealType)}
          onRemoveFood={onRemoveFood}
        />
      ))}
    </div>
  );
};

export default MealLogger;

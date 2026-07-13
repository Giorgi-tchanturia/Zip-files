import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import { GameCard } from './GameCard';


vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));


const renderComponent = (props) => {
  return render(
    <BrowserRouter>
      <GameCard {...props} />
    </BrowserRouter>
  );
};


test('renders game title and price correctly', () => {
  const mockProps = {
    id: 1,
    title: 'The Witcher 3',
    image: 'witcher3.jpg',
    price: '₾ 59.99',
    isAdded: false,
    onAddToLibrary: vi.fn(),
  };

  renderComponent(mockProps);

  expect(screen.getByText('The Witcher 3')).toBeInTheDocument();
  expect(screen.getByText('₾ 59.99')).toBeInTheDocument();
  expect(screen.getByText('+ დამატება')).toBeInTheDocument();
});


test('shows "დამატებულია" text when isAdded is true', () => {
  const mockProps = {
    id: 1,
    title: 'Cyberpunk 2077',
    image: 'cyberpunk.jpg',
    price: '₾ 59.99',
    isAdded: true,
    onAddToLibrary: vi.fn(),
  };

  renderComponent(mockProps);


  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('დამატებულია ✓');
  expect(button).toBeDisabled();
});
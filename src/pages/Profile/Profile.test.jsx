import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import { Profile } from './Profile';

const mockLogout = vi.fn();
const mockClearLibrary = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'GamerKing', email: 'gamer@king.com', avatar: null },
    logout: mockLogout,
    updateProfile: vi.fn(),
  }),
}));

vi.mock('../../context/LibraryContext', () => ({
  useLibrary: () => ({
    ownedItems: [{ dealID: '1' }, { dealID: '2' }],
    cartItems: [{ dealID: '3' }],
    clearLibrary: mockClearLibrary,
  }),
}));

const renderProfile = () =>
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );

test('renders username, email and library stats', () => {
  renderProfile();

  expect(screen.getByText('GamerKing')).toBeInTheDocument();
  expect(screen.getByText('gamer@king.com')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument(); // owned games
  expect(screen.getByText('1')).toBeInTheDocument(); // cart items
});

test('falls back to initial avatar when no photo is set', () => {
  renderProfile();

  expect(screen.getByText('G')).toBeInTheDocument();
});

test('calls logout and clears the library on sign out', () => {
  renderProfile();

  fireEvent.click(screen.getByText('გამოსვლა'));

  expect(mockLogout).toHaveBeenCalled();
  expect(mockClearLibrary).toHaveBeenCalled();
});
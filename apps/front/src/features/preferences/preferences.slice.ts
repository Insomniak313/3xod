import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreference } from '@3xod/shared';

export interface PreferenceOption {
  id: string;
  label: string;
  key: UserPreference['key'];
  value: string;
}

interface PreferencesState {
  options: PreferenceOption[];
  selected: PreferenceOption[];
}

const DEFAULT_OPTIONS: PreferenceOption[] = [
  { id: 'budget-friendly', label: 'Budget < 500€', key: 'budget', value: 'moins-500' },
  { id: 'mild-weather', label: 'Climat doux', key: 'weatherTolerance', value: 'doux' },
  { id: 'nature-break', label: 'Nature & calme', key: 'ambiance', value: 'calme' },
  { id: 'city-vibes', label: 'City vibes', key: 'ambiance', value: 'urbain' },
  { id: 'short-trip', label: '48h chrono', key: 'duration', value: '48h' },
  { id: 'nearby', label: '< 3h de vol', key: 'distance', value: '3h' },
];

const initialState: PreferencesState = {
  options: DEFAULT_OPTIONS,
  selected: [DEFAULT_OPTIONS[0], DEFAULT_OPTIONS[2]],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    togglePreference(state, action: PayloadAction<PreferenceOption>) {
      const exists = state.selected.find((pref) => pref.id === action.payload.id);
      if (exists) {
        state.selected = state.selected.filter((pref) => pref.id !== action.payload.id);
      } else {
        state.selected = [...state.selected, action.payload];
      }
    },
    resetPreferences(state) {
      state.selected = [];
    },
  },
});

export const { togglePreference, resetPreferences } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;

export const selectPreferenceOptions = (state: { preferences: PreferencesState }) =>
  state.preferences.options;
export const selectSelectedPreferences = (state: { preferences: PreferencesState }) =>
  state.preferences.selected;
export const selectUserPreferences = (state: { preferences: PreferencesState }): UserPreference[] =>
  state.preferences.selected.map((pref) => ({ key: pref.key, value: pref.value }));

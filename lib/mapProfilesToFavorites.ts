import { Profile } from "./types";

// Type for a single favorite item
interface Favorite {
  uid: string;
}

// Type for the full favorites object
export interface FavoritesData {
  favorites: Favorite[];
} /**
 * Creates a new array of Profile objects, each with an added `isFavorite` boolean field.
 * @param profilesArray The original array of Profile objects.
 * @param favsData The object containing the list of favorite UIDs.
 * @returns A new array with the merged data.
 */
export default function mapProfilesToFavorites(
  profilesArray: Profile[],
  favsData: FavoritesData,
) {
  // 1. For efficient lookups, create a Set of all favorite UIDs.
  // This lets us check if a profile is a favorite in O(1) time
  // instead of iterating through the favorites array every time (O(n)).
  const favoriteUidSet = new Set(favsData.favorites.map((fav) => fav.uid));

  // 2. Use the .map() method to transform the profiles array.
  // This creates a new array without modifying the original.
  const profilesWithFavorites = profilesArray.map((profile) => {
    // 3. For each profile, check if its 'id' exists in our favorite Set.
    const isFavorite = favoriteUidSet.has(profile.id);

    // 4. Return a new object that includes all original profile data
    //    (using the spread operator '...') plus the new 'isFavorite' field.
    return {
      ...profile,
      isFavorited: isFavorite,
    };
  });

  return profilesWithFavorites;
}

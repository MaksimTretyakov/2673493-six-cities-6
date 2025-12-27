import { dataProcess } from './data-process';
import {
  fetchOffersAction,
  fetchOfferAction,
  fetchCommentsAction,
  fetchNearbyOffersAction,
  toggleFavoriteStatusAction,
  fetchFavoriteOffersAction,
} from '../api-actions';
import { makeFakeOffer, makeFakeReview } from '../../utils/mocks';

describe('DataProcess Reducer', () => {
  const initialState = {
    offers: [],
    favoriteOffers: [],
    isOffersDataLoading: false,
    isOfferDataLoading: true,
    isCommentSubmitting: false,
    currentOffer: null,
    comments: [],
    nearbyOffers: [],
  };

  const offers = [makeFakeOffer(), makeFakeOffer()];
  const offer = makeFakeOffer();
  const reviews = [makeFakeReview(), makeFakeReview()];

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = dataProcess(initialState, emptyAction);
    expect(result).toEqual(initialState);
  });

  describe('fetchOffersAction', () => {
    it('should set isOffersDataLoading to true on pending', () => {
      const action = { type: fetchOffersAction.pending.type };
      const result = dataProcess(initialState, action);
      expect(result.isOffersDataLoading).toBe(true);
    });

    it('should load offers and set isOffersDataLoading to false on fulfilled', () => {
      const action = {
        type: fetchOffersAction.fulfilled.type,
        payload: offers,
      };
      const result = dataProcess(initialState, action);
      expect(result.offers).toEqual(offers);
      expect(result.isOffersDataLoading).toBe(false);
    });

    it('should set isOffersDataLoading to false on rejected', () => {
      const action = { type: fetchOffersAction.rejected.type };
      const result = dataProcess(initialState, action);
      expect(result.isOffersDataLoading).toBe(false);
    });
  });

  describe('fetchOfferAction', () => {
    it('should set isOfferDataLoading to true on pending', () => {
      const action = { type: fetchOfferAction.pending.type };
      const result = dataProcess(initialState, action);
      expect(result.isOfferDataLoading).toBe(true);
    });

    it('should load offer and set isOfferDataLoading to false on fulfilled', () => {
      const action = { type: fetchOfferAction.fulfilled.type, payload: offer };
      const result = dataProcess(initialState, action);
      expect(result.currentOffer).toEqual(offer);
      expect(result.isOfferDataLoading).toBe(false);
    });
  });

  describe('fetchCommentsAction', () => {
    it('should load comments on fulfilled', () => {
      const action = {
        type: fetchCommentsAction.fulfilled.type,
        payload: reviews,
      };
      const result = dataProcess(initialState, action);
      expect(result.comments).toEqual(reviews);
    });
  });

  it('should set comments to empty array on rejected', () => {
    const stateWithData = { ...initialState, comments: reviews };
    const action = { type: fetchCommentsAction.rejected.type };
    const result = dataProcess(stateWithData, action);
    expect(result.comments).toEqual([]);
  });

  describe('fetchNearbyOffersAction', () => {
    it('should load nearby offers on fulfilled', () => {
      const action = {
        type: fetchNearbyOffersAction.fulfilled.type,
        payload: offers,
      };
      const result = dataProcess(initialState, action);
      expect(result.nearbyOffers).toEqual(offers);
    });
  });

  it('should set nearby offers to empty array on rejected', () => {
    const stateWithData = { ...initialState, nearbyOffers: offers };
    const action = { type: fetchNearbyOffersAction.rejected.type };
    const result = dataProcess(stateWithData, action);
    expect(result.nearbyOffers).toEqual([]);
  });

  describe('toggleFavoriteStatusAction', () => {
    it('should update offer in offers list on fulfilled', () => {
      const state = { ...initialState, offers: [offer] };
      const updatedOffer = { ...offer, isFavorite: true };
      const action = {
        type: toggleFavoriteStatusAction.fulfilled.type,
        payload: updatedOffer,
      };
      const result = dataProcess(state, action);
      expect(result.offers[0].isFavorite).toBe(true);
    });
  });

  describe('fetchFavoriteOffersAction', () => {
    it('should load favorite offers on fulfilled', () => {
      const action = {
        type: fetchFavoriteOffersAction.fulfilled.type,
        payload: offers,
      };
      const result = dataProcess(initialState, action);
      expect(result.favoriteOffers).toEqual(offers);
    });

    it('should set favorite offers to empty array on rejected', () => {
      const stateWithData = { ...initialState, favoriteOffers: offers };
      const action = { type: fetchFavoriteOffersAction.rejected.type };
      const result = dataProcess(stateWithData, action);
      expect(result.favoriteOffers).toEqual([]);
    });
  });
});

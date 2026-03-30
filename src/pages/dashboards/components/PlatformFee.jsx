import React, { useState, useEffect } from 'react';
import { BadgePercent, Plane, Building2, Layers, MapPin, Globe, ChevronDown, Check } from 'lucide-react';
import { platformFeeService } from '../../../services/platformFeeService';
import { Country, State, City } from 'country-state-city';

const PlatformFee = () => {
  const [selectedModule, setSelectedModule] = useState('both');
  const [locationType, setLocationType] = useState('global'); // 'global' or 'specific'
  
  // Location Selections
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCityObj, setSelectedCityObj] = useState(null);

  // Deriving the final "selectedCity" name to use with backend
  const selectedCity = selectedCityObj ? selectedCityObj.name : null;

  const [allFees, setAllFees] = useState([]); 
  const [fees, setFees] = useState({ flight: 0, hotel: 0 }); 
  
  const [feeInput, setFeeInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const platformFeeIconPath = '/src/assets/platform-fee.png';
  const [imageError, setImageError] = useState(false);

  // Dropdown options
  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setIsLoading(true);
      const response = await platformFeeService.getPlatformFees();
      if (response && response.data) {
        setAllFees(response.data);
        updateDisplayedFees(response.data, locationType, selectedCity);
      }
    } catch (error) {
      console.error('Failed to fetch platform fees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDisplayedFees = (feesData, locType, cityStr) => {
    let flightFee = 0;
    let hotelFee = 0;

    if (locType === 'global') {
      flightFee = feesData.find(f => f.module === 'flight' && f.isDefault && (f.city === null || f.city === ''))?.amount || 0;
      hotelFee = feesData.find(f => f.module === 'hotel' && f.isDefault && (f.city === null || f.city === ''))?.amount || 0;
    } else if (locType === 'specific' && cityStr) {
      flightFee = feesData.find(f => f.module === 'flight' && !f.isDefault && f.city?.toLowerCase() === cityStr.toLowerCase())?.amount || 0;
      hotelFee = feesData.find(f => f.module === 'hotel' && !f.isDefault && f.city?.toLowerCase() === cityStr.toLowerCase())?.amount || 0;
    }

    setFees({ flight: flightFee, hotel: hotelFee });
    
    // Update input field based on selected module
    if (selectedModule === 'flight') setFeeInput(flightFee);
    else if (selectedModule === 'hotel') setFeeInput(hotelFee);
    else setFeeInput('');
  };

  useEffect(() => {
    updateDisplayedFees(allFees, locationType, selectedCity);
  }, [selectedModule, locationType, selectedCity, allFees]);

  const handleCountryChange = (e) => {
      const country = countries.find(c => c.isoCode === e.target.value);
      setSelectedCountry(country);
      setSelectedState(null);
      setSelectedCityObj(null);
  };

  const handleStateChange = (e) => {
      const state = states.find(s => s.isoCode === e.target.value);
      setSelectedState(state);
      setSelectedCityObj(null);
  };

  const handleCityChange = (e) => {
      const city = cities.find(c => c.name === e.target.value);
      setSelectedCityObj(city);
  };

  const handleSave = async () => {
    if (feeInput === '' || isNaN(feeInput)) return;
    if (locationType === 'specific' && !selectedCity) return;
    
    setIsSaving(true);
    try {
      const cityParam = locationType === 'specific' ? selectedCity : null;
      await platformFeeService.updatePlatformFee(selectedModule, Number(feeInput), 'percentage', cityParam);
      
      await fetchFees();
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      if (selectedModule === 'both') {
         setFeeInput('');
      } 
    } catch (error) {
       console.error('Failed to update platform fee:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="premium-card p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-4">
          <div className="p-2 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
            {!imageError ? (
              <img
                src={platformFeeIconPath}
                alt="Platform Fee"
                className="w-8 h-8 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <BadgePercent className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <span className="tracking-tight">Financial Settings</span>
        </h3>
        <p className="text-gray-500 mt-2 text-sm ml-[3.5rem]">
          Configure default platform fees or apply overrides for specific locations worldwide.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="bg-orange-50/20 rounded-[2rem] p-8 border border-orange-100/60 backdrop-blur-sm relative overflow-hidden shadow-inner flex flex-col gap-10">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin shadow-lg"></div>
             <p className="mt-4 text-orange-600 font-bold tracking-widest text-sm animate-pulse">SYNCING</p>
          </div>
        )}

        {/* 1. Module Selection (Top Level) */}
        <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm shadow-sm ring-4 ring-white">1</div>
               <h4 className="text-lg font-bold text-gray-800">Select Module</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-11">
              <button
                onClick={() => setSelectedModule('flight')}
                className={`flex py-4 px-6 rounded-2xl items-center justify-center gap-3 font-bold transition-all duration-300 border-2 ${
                  selectedModule === 'flight' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'bg-white border-transparent text-gray-500 hover:border-orange-200 hover:text-orange-500 hover:shadow shadow-sm'
                }`}
              >
                <Plane className={`w-5 h-5 ${selectedModule === 'flight' ? 'text-white' : 'text-orange-400'}`} /> <span className="text-lg">Flights</span>
                {selectedModule === 'flight' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>}
              </button>
              <button
                onClick={() => setSelectedModule('hotel')}
                className={`flex py-4 px-6 rounded-2xl items-center justify-center gap-3 font-bold transition-all duration-300 border-2 ${
                  selectedModule === 'hotel' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'bg-white border-transparent text-gray-500 hover:border-orange-200 hover:text-orange-500 hover:shadow shadow-sm'
                }`}
              >
                <Building2 className={`w-5 h-5 ${selectedModule === 'hotel' ? 'text-white' : 'text-orange-400'}`} /> <span className="text-lg">Hotels</span>
                {selectedModule === 'hotel' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>}
              </button>
              <button
                onClick={() => setSelectedModule('both')}
                className={`flex py-4 px-6 rounded-2xl items-center justify-center gap-3 font-bold transition-all duration-300 border-2 ${
                  selectedModule === 'both' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'bg-white border-transparent text-gray-500 hover:border-orange-200 hover:text-orange-500 hover:shadow shadow-sm'
                }`}
              >
                <Layers className={`w-5 h-5 ${selectedModule === 'both' ? 'text-white' : 'text-orange-400'}`} /> <span className="text-lg">Both</span>
                {selectedModule === 'both' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>}
              </button>
            </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-50"></div>

        {/* 2. Location Selection */}
        <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm shadow-sm ring-4 ring-white">2</div>
               <h4 className="text-lg font-bold text-gray-800">Target Location</h4>
            </div>

            <div className="ml-11 flex flex-col gap-6">
                <div className="flex gap-4 p-1.5 bg-gray-100/50 backdrop-blur-sm rounded-2xl w-fit border border-gray-200/50">
                  <button
                    onClick={() => { setLocationType('global'); setSelectedCountry(null); setSelectedState(null); setSelectedCityObj(null); }}
                    className={`py-2 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 text-sm ${
                      locationType === 'global' ? 'bg-white text-gray-800 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${locationType === 'global' ? 'text-orange-500' : ''}`} /> Global Default
                  </button>
                  {/* <button
                    onClick={() => setLocationType('specific')}
                    className={`py-2 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 text-sm ${
                      locationType === 'specific' ? 'bg-white text-gray-800 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${locationType === 'specific' ? 'text-orange-500' : ''}`} /> Specific City Overrides
                  </button> */}
                </div>

                {/* 3 Boxes configuration for Location Search */}
                {locationType === 'specific' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
                        
                        {/* Country Box */}
                        <div className="flex flex-col gap-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Country</label>
                             <div className="relative">
                                 <select 
                                     value={selectedCountry ? selectedCountry.isoCode : ''}
                                     onChange={handleCountryChange}
                                     className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-3.5 pl-4 pr-10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all cursor-pointer"
                                 >
                                     <option value="" disabled>Select Country</option>
                                     {countries.map(country => (
                                         <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                     ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                             </div>
                        </div>

                        {/* State Box */}
                        <div className="flex flex-col gap-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                                State/Province
                                {!selectedCountry && <span className="text-orange-400 text-[10px] bg-orange-50 px-2 py-0.5 rounded-full lowercase tracking-normal">Requires Country</span>}
                             </label>
                             <div className="relative">
                                 <select 
                                     value={selectedState ? selectedState.isoCode : ''}
                                     onChange={handleStateChange}
                                     disabled={!selectedCountry}
                                     className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-3.5 pl-4 pr-10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     <option value="" disabled>Select State</option>
                                     {states.map(state => (
                                         <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                     ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                             </div>
                        </div>

                        {/* City Box */}
                        <div className="flex flex-col gap-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                                City
                                {selectedCountry && !selectedState && <span className="text-orange-400 text-[10px] bg-orange-50 px-2 py-0.5 rounded-full lowercase tracking-normal">Requires State</span>}
                             </label>
                             <div className="relative">
                                 <select 
                                     value={selectedCityObj ? selectedCityObj.name : ''}
                                     onChange={handleCityChange}
                                     disabled={!selectedState}
                                     className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-3.5 pl-4 pr-10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     <option value="" disabled>Select City</option>
                                     {cities.map((city, idx) => (
                                         <option key={`${city.name}-${idx}`} value={city.name}>{city.name}</option>
                                     ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                             </div>
                        </div>

                    </div>
                )}
            </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-50"></div>

        {/* 3. Fee Input and Display */}
        <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm shadow-sm ring-4 ring-white">3</div>
               <h4 className="text-lg font-bold text-gray-800">Set Fee Percentage</h4>
            </div>

            <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-50 to-transparent rounded-full -mr-20 -mt-20 opacity-50"></div>
                
                {/* Current Metrics */}
                <div className="flex flex-col z-10 border-r border-gray-100 pr-8">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       Current Active Fees
                       {locationType === 'specific' && selectedCity ? (
                           <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] flex items-center gap-1"><MapPin className="w-3 h-3"/> {selectedCity}</span>
                       ) : locationType === 'global' ? (
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] flex items-center gap-1"><Globe className="w-3 h-3"/> Global</span>
                       ) : null}
                     </p>
                     
                     <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <Plane className="w-5 h-5 text-gray-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Flights</p>
                               <p className="text-xl font-bold tracking-tight text-gray-800">{fees.flight}%</p>
                             </div>
                         </div>
                         <div className="w-px h-8 bg-gray-200/80 mx-2"></div>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <Building2 className="w-5 h-5 text-gray-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Hotels</p>
                               <p className="text-xl font-bold tracking-tight text-gray-800">{fees.hotel}%</p>
                             </div>
                         </div>
                     </div>
                </div>

                {/* Input Area */}
                <div className="flex flex-col gap-4 z-10">
                     <div className="relative group">
                       <style>
                         {`
                           input::-webkit-outer-spin-button,
                           input::-webkit-inner-spin-button {
                             -webkit-appearance: none;
                             margin: 0;
                           }
                           input[type=number] {
                             -moz-appearance: textfield;
                           }
                         `}
                       </style>
                       <input
                         type="number"
                         min="0"
                         max="100"
                         step="0.1"
                         value={feeInput}
                         onChange={(e) => setFeeInput(e.target.value)}
                         className="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-3xl font-bold text-gray-800 transition-all text-center"
                         placeholder="0.0"
                       />
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                         <span className="text-orange-400 font-bold text-2xl">%</span>
                       </div>
                     </div>

                     <button
                       onClick={handleSave}
                       disabled={isSaving || feeInput === '' || isNaN(feeInput) || (locationType === 'specific' && !selectedCity)}
                       className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-3 whitespace-nowrap group active:scale-95 text-lg ${
                         (isSaving || feeInput === '' || isNaN(feeInput) || (locationType === 'specific' && !selectedCity)) 
                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200' 
                         : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 border border-transparent'
                       }`}
                     >
                       {isSaving ? (
                         <>
                           <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                           Applying Configuration...
                         </>
                       ) : locationType === 'global' ? (
                           <>Update Globally</>
                       ) : (
                           <>Override {selectedCity ? `for ${selectedCity}` : 'Location'}</>
                       )}
                     </button>
                     
                     <p className="text-xs text-center text-gray-400 font-medium">
                         {locationType === 'global' 
                            ? 'Saving a global default will overwrite existing fees for all currently customized cities as well.' 
                            : 'This fee will override the global default specifically for users booking from this location.'}
                     </p>
                </div>
            </div>
        </div>

      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSuccess(false)}
          ></div>
          <div className="bg-white rounded-[2rem] p-10 shadow-2xl z-10 flex flex-col items-center max-w-sm w-full mx-4 border border-gray-100 transform transition-all scale-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-green-50/50">
               <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Success!</h4>
            <p className="text-gray-500 text-center text-base font-medium mb-8">
              Platform fee has been set to <strong className="text-gray-800">{feeInput}%</strong> for <span className="font-bold capitalize text-orange-500">{selectedModule}</span> in <span className="font-bold text-gray-800">{locationType === 'global' ? 'all Global locations' : selectedCity}</span>.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors w-full tracking-wide shadow-lg shadow-gray-900/20"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformFee;

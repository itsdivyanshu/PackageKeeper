import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReuseInput } from '@locoworks/reusejs-react-input';
import { HeadlessButton } from '@locoworks/reusejs-react-button';

interface Package {
    name: string;
    description?: string;
}

function AddPackage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchPackages = async () => {
            if (query) {
                try {
                    const response = await axios.get(`https://api.npms.io/v2/search?q=${query}`);
                    const packages = response.data.results.map((pkg: any) => ({
                        name: pkg.package.name
                    }));
                    setResults(packages);
                } catch (error) {
                    console.error('Error fetching packages:', error);
                }
            } else {
                setResults([]);
            }
        };

        fetchPackages();
    }, [query]);

    const handleSubmit = async () => {
        if (!selectedPackage || !description) {
            console.log('Please select a package and provide a description.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/packages', {
                packageName: selectedPackage,
                description: description,
            });

            console.log('Submitted:', response.data);
        } catch (error) {
            console.error('Error submitting package:', error);
        }

        setQuery('');
        setSelectedPackage('');
        setDescription('');
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
                    Search for NPM Packages
                </label>
                <ReuseInput
                    id="search"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="web3"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Results</label>
                <div className="max-h-32 overflow-y-auto border rounded">
                    {results.map(pkg => (
                        <div key={pkg.name} className="p-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="package"
                                    value={pkg.name}
                                    checked={selectedPackage === pkg.name}
                                    onChange={() => setSelectedPackage(pkg.name)}
                                />
                                <span className="ml-2">{pkg.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Why is this your fav?
                </label>
                <ReuseInput
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your description here..."
                />
            </div>
            <HeadlessButton
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto block"
                onClick={handleSubmit}
            >
                Submit
            </HeadlessButton>
        </div>
    );
}

export default AddPackage;

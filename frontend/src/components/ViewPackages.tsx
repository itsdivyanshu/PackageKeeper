import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface Package {
    id: number;
    packagename: string;
    description: string;
}

const ViewPackages: React.FC = () => {
    const [favPackages, setFavPackages] = useState<Package[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editDescription, setEditDescription] = useState<string>('');
    const [deleteCandidate, setDeleteCandidate] = useState<number | null>(null);
    const [viewDescription, setViewDescription] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/packages`);
                setFavPackages(response.data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };

        fetchPackages();
    }, []);

    console.log(favPackages); //check

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/packages/${id}`);
            const updatedPackages = favPackages.filter(pkg => pkg.id !== id);
            setFavPackages(updatedPackages);
            setDeleteCandidate(null);
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const handleEdit = (pkg: Package) => {
        setIsEditing(pkg.id);
        setEditDescription(pkg.description);
    };

    const handleSave = async (id: number) => {
        if (editDescription.trim() === '') {
            setErrorMessage('Description cannot be empty.');
            return;
        }

        try {
            await axios.put(`http://localhost:3000/api/packages/${id}`, { description: editDescription });
            const updatedPackages = favPackages.map(pkg =>
                pkg.id === id ? { ...pkg, description: editDescription } : pkg
            );
            setFavPackages(updatedPackages);
            setIsEditing(null);
            setEditDescription('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Your Fav NPM Packages</h1>
            {favPackages.length === 0 ? (
                <div className="border rounded p-4 text-center">
                    <p className="mb-4">You don't have any favs yet.</p>
                    <Link to="/add-new-package" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                        Add Fav
                    </Link>
                </div>
            ) : (
                <div>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Package Name</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favPackages.map(pkg => (
                                <tr key={pkg.id}> 
                                    <td className="py-2 px-4 border-b">{pkg.packagename || 'No Package Name'}</td>
                                    <td className="py-2 px-4 border-b">
                                        {isEditing === pkg.id ? (
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className="border rounded px-2 py-1 mr-2"
                                                />
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleSave(pkg.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded ml-2"
                                                    onClick={() => setIsEditing(null)}
                                                >
                                                    Cancel
                                                </button>
                                                {errorMessage && (
                                                    <p className="text-red-500 ml-2">{errorMessage}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleEdit(pkg)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                                    onClick={() => setDeleteCandidate(pkg.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
                                                    onClick={() => setViewDescription(pkg.id)}
                                                >
                                                    <FaEye />
                                                </button>
                                            </div>
                                        )}
                                        {deleteCandidate === pkg.id && (
                                            <div className="mt-2">
                                                <p>Are you sure you want to delete {pkg.packagename}?</p>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                                                    onClick={() => handleDelete(pkg.id)}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mt-2 ml-2"
                                                    onClick={() => setDeleteCandidate(null)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        )}
                                        {viewDescription === pkg.id && (
                                            <div className="mt-2">
                                                <p>{pkg.description}</p>
                                                <button
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mt-2"
                                                    onClick={() => setViewDescription(null)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewPackages;

const Movie = require('../models/Movie');
const url = 'http://localhost:3000/soapService?wsdl';


const createSoapClient = async () => {
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) {
                console.error('Error creating SOAP client:', err);
                reject(err);
            } else {
                console.log('SOAP client created successfully');
                resolve(client);
            }
        });
    });
};

const soapService = {
    
    createMovie: async (movieData) => {
        try {
            
            const newMovie = new Movie(movieData);
            
            const savedMovie = await newMovie.save();
           
            return savedMovie;
        } catch (error) {
            console.error('Error creating movie:', error);
            throw new Error('Failed to create movie');
        }
    },

    
    getAllMovies: async () => {
        try {
           
            const movies = await Movie.find();
         
            return movies;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw new Error('Failed to fetch movies');
        }
    },

    getMovieById: async (id) => {
        try {
           
            const movie = await Movie.findById(id);
            
            if (!movie) {
                throw new Error('Movie not found');
            }
            
            return movie;
        } catch (error) {
            console.error('Error fetching movie by ID:', error);
            throw new Error('Failed to fetch movie by ID');
        }
    },

    updateMovie: async (id, updatedMovieData) => {
        try {
         
            const updatedMovie = await Movie.findByIdAndUpdate(id, updatedMovieData, { new: true });
           
            if (!updatedMovie) {
                throw new Error('Movie not found');
            }
          
            return updatedMovie;
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new Error('Failed to update movie');
        }
    },

   
    deleteMovie: async (id) => {
        try {
          
            const deletedMovie = await Movie.findByIdAndDelete(id);
            
            if (!deletedMovie) {
                throw new Error('Movie not found');
            }
         
            return deletedMovie;
        } catch (error) {
            console.error('Error deleting movie:', error);
            throw new Error('Failed to delete movie');
        }
    },
    createUser: async (userData) => {
        try {
            const newUser = await User.create(userData);
            console.log('User created:', newUser);
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    },
    readUser: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            console.log('User details:', user);
            return user;
        } catch (error) {
            console.error('Error reading user details:', error);
            throw new Error('Failed to read user details');
        }
    },
    updateUser: async (userId, updatedUserData) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            console.log('User updated:', updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    },
    deleteUser: async (userId) => {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new Error('User not found');
            }
            console.log('User deleted:', deletedUser);
            return deletedUser;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    },
    authenticateUser: async (username, password) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
            console.log('User authenticated:', user);
            return user;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error('Failed to authenticate user');
        }
    },
    wsdl: () => {
        
        const wsdlDefinition = `
            <definitions
                xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:tns="http://example.com/wsdl"
                targetNamespace="http://example.com/wsdl"
            >
                <types>
                    <xsd:schema>
                    
                    </xsd:schema>
                </types>
                <message name="CreateUserRequest">
                   
                </message>
                <message name="CreateUserResponse">
                   
                </message>
                <portType name="UserService">
                    
                    <operation name="createUser">
                        <input message="tns:CreateUserRequest"/>
                        <output message="tns:CreateUserResponse"/>
                    </operation>
                    
                </portType>
                <binding name="UserServiceSOAP" type="tns:UserService">
                   
                    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
                    <operation name="createUser">
                        <soap:operation soapAction="createUser"/>
                        <input>
                            <soap:body use="literal"/>
                        </input>
                        <output>
                            <soap:body use="literal"/>
                        </output>
                    </operation>
                  
                </binding>
                <service name="UserService">
                   
                    <port name="UserServicePort" binding="tns:UserServiceSOAP">
                        <soap:address location="http://localhost:3000/soapService"/>
                    </port>
                </service>
            </definitions>
        `;
        return wsdlDefinition;
    }
};


module.exports = {
    createSoapClient,
    soapService
};
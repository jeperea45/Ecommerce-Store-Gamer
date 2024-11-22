import axios from 'axios';
const API_URL = "http://localhost:5008/items";
const API_URL2 = "http://localhost:5008/auth";
const API_URL3 = "http://localhost:5008/products";

// Función que a través de un método POST envía los datos a la BD
export const registerUser = async (form) => {
    const response = await fetch(`${API_URL2}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    });

    const data = await response.json();
    return data;
};

// Función de inicio de sesión
export const loginUser = async (form) => {
    try {
        const response = await fetch(`${API_URL2}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
        throw error;
    };
};

// Función para obtener los detalles del usuario
// services/userService.js


export const getUser = (userId) => {
    return axios.get(`/users/${userId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error obteniendo el usuario:', error);
            throw error;
        });
};


// Función para obtener los productos
export const getItems = async (userId) => {
    try {
        // Verificar si userId existe antes de hacer la solicitud
        if (!userId) {
            throw new Error('El userId no es válido.');
        }

        const response = await fetch(`${API_URL}?userId=${userId}`);  // Asegúrate de que la URL sea correcta
        
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};

// Función para obtener los productos
// Función para obtener los productos sin verificación de userId
export const getItemsPageMain = async () => {
    try {
      const response = await fetch(`${API_URL3}`, {
        method: 'GET', // Asegúrate de que el método sea correcto
        headers: {
          'Content-Type': 'application/json' // Asegúrate de que los encabezados sean correctos
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener los productos: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  };
  
  

// Función para agregar un item
export const addItem = async (formData) => {
    try {
        // Obtener el userId desde localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
            throw new Error('Usuario no autenticado');
        }

        // Agregar userId a formData
        formData.append('userId', user._id);

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData, // Enviar FormData sin encabezado 'Content-Type' explícito
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al agregar el item.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud de agregar item:', error);
        throw new Error('Hubo un problema al agregar el producto. Intenta nuevamente.');
    }
};

// Función para eliminar un item
export const deleteItem = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el item.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud de eliminar item:', error);
        throw new Error('Hubo un problema al eliminar el producto. Intenta nuevamente.');
    }
};

// Función para actualizar un item
export const updateItem = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: formData // Enviar FormData sin el encabezado 'Content-Type'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el item.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud de actualizar item:', error);
        throw new Error('Hubo un problema al actualizar el producto. Intenta nuevamente.');
    }
};

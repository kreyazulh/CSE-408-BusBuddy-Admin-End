const request = require('supertest');
const app = require('./index');

describe('POST /api/bus/add', () => {
    it('should insert a new bus and return true', async () => {
      const newBus = {
        reg_id: 'BA-11-1234',
        type: 'mini',
        capacity: 40,
        remarks: 'New bus added'
      };
  
      const res = await request(app)
        .post('/api/bus/add') // Adjust the path if your route is different
        .send(newBus)
        .expect(200); // Adjust this if your endpoint sends a different status code
  
      // Check if the response is as expected
      expect(res.body).toBe(true);
    });
  
    it('should fail to insert a new bus and return false', async () => {
      // Sending invalid data or missing fields should result in an error
      const invalidBus = {
        reg_id: '123ABC',
        type: 'Standard',
        // 'capacity' is intentionally missing to provoke an error
        remarks: 'Missing capacity'
      };
  
      const res = await request(app)
        .post('/api/bus/add') // Adjust the path if your route is different
        .send(invalidBus)
        .expect(200); // Adjust this if your endpoint sends a different status code
  
      // Check if the response is as expected
      expect(res.body).toBe(false);
    });

  });

  describe('DELETE /api/bus/delete', () => {
    it('should delete a bus and return a success message', async () => {
      const busToDelete = {
        id: 'BA-11-1234', // Use the ID of the bus you want to delete
      };
  
      const res = await request(app)
        .delete('/api/bus/delete') // Adjust if your route is different
        .send(busToDelete)
        .expect(200); // Adjust if your endpoint sends a different status code
  
      // Check if the response is as expected
      expect(res.body).toEqual({ message: 'Bus deleted successfully' });
    });
  
  });

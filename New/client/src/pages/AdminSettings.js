import React from 'react';

function AdminSettings() {
  return (
    <div className="container mt-4">
      <h2>System Settings</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Inventory Settings</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Default Minimum Threshold</label>
                  <input type="number" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Default Items per Box</label>
                  <input type="number" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings; 
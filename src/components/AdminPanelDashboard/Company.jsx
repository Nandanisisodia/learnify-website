import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Plus, CheckCircle, XCircle, Trash2 } from "lucide-react";
import axios from "axios";

export default function Company() {
  const [newCompany, setNewCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      if (res.data.success) setCompanies(res.data.data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async () => {
    if (!newCompany.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/companies", { name: newCompany });
      setNewCompany("");
      fetchCompanies();
    } catch (err) {
      console.error("Failed to add company:", err);
    }
  };

  const handleCompanyApproval = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/companies/${id}/status`, { status: action });
      fetchCompanies();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleHiresUpdate = async (id, hires) => {
  try {
    await axios.patch(`http://localhost:5000/api/companies/${id}/hires`, { hires: Number(hires) });
    fetchCompanies();
  } catch (err) {
    console.error("Hires update failed:", err);
  }
};

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage Companies
      </motion.h2>

      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-4">
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            placeholder="Add new company..."
            className="input-field flex-1"
          />
          <motion.button
            onClick={addCompany}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Company
          </motion.button>
        </div>
      </motion.div>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500">No companies added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              className="stat-card p-6 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-secondary">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                    <span className={`px-2 py-1 rounded-xl text-xs font-medium ${
                      company.status === "approved" ? "bg-success/20 text-success" :
                      company.status === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-warning/20 text-warning"
                    }`}>
                      {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(company.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
  <Users className="w-4 h-4" />
  <input
    type="number"
    value={company.hires}
    onChange={(e) => handleHiresUpdate(company.id, e.target.value)}
    className="w-16 px-2 py-1 border rounded text-foreground"
    min="0"
  />
  <span>Hires</span>
</div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleCompanyApproval(company.id, "approved")}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </motion.button>
                <motion.button
                  onClick={() => handleCompanyApproval(company.id, "rejected")}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
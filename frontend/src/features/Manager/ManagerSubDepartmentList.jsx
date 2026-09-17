import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Users, Palette, Video, PenTool, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ManagerSubDepartmentList = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};
  const departmentId = managerProfile.department_id;

  const [subDepartments, setSubDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!departmentId) return;
    setLoading(true);
    try {
      const [subDeptRes, empRes] = await Promise.all([
        api.get(`/departments/${departmentId}/sub-departments`),
        api.get('/users/employees', {
          params: { departmentFilter: departmentId, limit: 100 }
        })
      ]);

      if (subDeptRes.data.success) {
        setSubDepartments(subDeptRes.data.data.subDepartments || []);
      }
      if (empRes.data.success) {
        setEmployees(empRes.data.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching sub-department data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSubDeptCardIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('graphic') || n.includes('design')) return <Palette size={32} />;
    if (n.includes('video') || n.includes('editor') || n.includes('edit')) return <Video size={32} />;
    if (n.includes('writer') || n.includes('content') || n.includes('blog')) return <PenTool size={32} />;
    return <Layers size={32} />;
  };

  const getSubDeptColorTheme = (name) => {
    const n = name.toLowerCase();
    if (n.includes('graphic') || n.includes('design')) {
      return {
        bg: '#e0f2fe',
        border: '#bae6fd',
        color: '#0369a1',
        iconBg: '#bae6fd'
      };
    }
    if (n.includes('video') || n.includes('editor') || n.includes('edit')) {
      return {
        bg: '#faf5ff',
        border: '#e9d5ff',
        color: '#6b21a8',
        iconBg: '#e9d5ff'
      };
    }
    if (n.includes('writer') || n.includes('content') || n.includes('blog')) {
      return {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        color: '#065f46',
        iconBg: '#a7f3d0'
      };
    }
    return {
      bg: '#f8fafc',
      border: '#e2e8f0',
      color: '#475569',
      iconBg: '#e2e8f0'
    };
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            Sub-departments
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage and view sub-department roles and work distribution inside your department.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p className="text-muted" style={{ fontWeight: 600 }}>Loading sub-departments...</p>
        </div>
      ) : subDepartments.length === 0 ? (
        <div className="card" style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Layers size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h4 style={{ margin: 0, fontWeight: 700 }}>No Sub-departments Found</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            No sub-departments are currently registered under your department.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {subDepartments.map(sd => {
            const count = employees.filter(emp => Number(emp.sub_department_id) === Number(sd.id) && emp.status === 'active').length;
            const theme = getSubDeptColorTheme(sd.name);
            return (
              <div 
                key={sd.id} 
                className="card" 
                style={{ 
                  padding: '24px', 
                  backgroundColor: theme.bg, 
                  borderColor: theme.border, 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: theme.color, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      CODE: {sd.code || 'N/A'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-color)' }}>
                      {sd.name}
                    </h3>
                  </div>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: theme.iconBg, 
                    color: theme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getSubDeptCardIcon(sd.name)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid ' + theme.border, paddingTop: '12px', marginTop: 'auto' }}>
                  <Users size={16} style={{ color: theme.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-color)' }}>
                    Active Employees: <strong style={{ fontSize: '15px', color: theme.color }}>{count}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagerSubDepartmentList;

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import AdminStructure from '../adminLayout';
import { getConfig, toggleStreamBar, toggleRegistration } from '../../../services/websiteactions';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

const AdminOptions = () => {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
      getConfig(setConfig, setIsFetching);
  }, [isUpdating]);

  const handleToggleStreamBar = useCallback(() => {
    if (!token || isUpdating) return;
    setIsUpdating(true);
    toggleStreamBar(token, setIsUpdating, toast).then(() => {
      getConfig(setConfig, setIsFetching);
    });
  }, [token, isUpdating]);

  const handleToggleRegistration = useCallback(() => {
    if (!token || isUpdating) return;
    setIsUpdating(true);
    toggleRegistration(token, setIsUpdating, toast).then(() => {
      getConfig(setConfig, setIsFetching);
    });
  }, [token, isUpdating])

  if (isFetching) {
    return (
      <AdminStructure>
        <AdminBodyHeader
          label="Options Administratives"
          catchphrase="Contrôlez les options du site"
          returnButton
        />
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse w-full h-64 bg-gray-300 rounded-md"></div>
        </div>
      </AdminStructure>
    );
  }

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Options Administratives"
        catchphrase="Contrôlez les options du site"
        returnButton
      />
      {isFetching ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse w-full h-64 bg-gray-300 rounded-md"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <label htmlFor="stream_banner_enabled" className="text-sm font-medium text-gray-700 mb-1">
                Bannière de streaming
              </label>
              <p className="text-xs text-gray-500">
                Active ou désactive l'affichage de la bannière de streaming sur le site
              </p>
            </div>
            <SwitchInput
              attribute="stream_banner_enabled"
              data={config}
              setAction={(value) => {
                if (typeof value === 'function') {
                  setConfig(value);
                } else {
                  setConfig(value);
                }
                handleToggleStreamBar();
              }}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <label htmlFor="registration_enabled" className="text-sm font-medium text-gray-700 mb-1">
                Autoriser les inscriptions
              </label>
              <p className="text-xs text-gray-500">
                Active ou désactive la possibilité pour les nouveaux utilisateurs de s'inscrire
              </p>
            </div>
            <SwitchInput
              attribute="registration_enabled"
              data={config}
              setAction={(value) => {
                if (typeof value === 'function') {
                  setConfig(value);
                } else {
                  setConfig(value);
                }
                handleToggleRegistration();
              }}
              disabled={isUpdating}
            />
          </div>
        </>
      )
      }
    </AdminStructure>
  );
};

export default AdminOptions;
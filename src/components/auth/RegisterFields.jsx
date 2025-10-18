import React, { useMemo, useState } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-components";
import {
    LockOutlined,
    UserOutlined,
    MailOutlined,
    IdcardOutlined,
    BankOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { checkUsername, checkEmail } from "../../api/checks.js";

export default function RegisterFields({ universitaOptions }) {
    const queryClient = useQueryClient();
    const [selectedUniId, setSelectedUniId] = useState(undefined);

    // Fallback statico ora, ma puoi passare universitaOptions via props o sostituire con fetch API
    const uniOptions = useMemo(
        () =>
            universitaOptions?.length
                ? universitaOptions
                : [
                    { label: "Università di Ferrara (UNIFE)", value: 1 },
                    { label: "Università di Bologna (UNIBO)", value: 2 },
                ],
        [universitaOptions]
    );

    // TODO: sostituisci con la tua API quando pronta
    // es.: const { data } = await api.get(`/universita/${uniId}/dipartimenti`);
    async function fetchDipartimentiByUni(uniId) {
        if (Number(uniId) === 1) {
            return [
                { label: "Ingegneria", value: 1 },
                { label: "Economia", value: 2 },
            ];
        }
        if (Number(uniId) === 2) {
            return [
                { label: "Informatica", value: 3 },
                { label: "Fisica", value: 4 },
            ];
        }
        return [];
    }

    return (
        <>
            {/* name */}
            <ProFormText
                name="name"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Nome"
                rules={[{ required: true, message: "Inserisci il nome!" }]}
            />

            {/* surname */}
            <ProFormText
                name="surname"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Cognome"
                rules={[{ required: true, message: "Inserisci il cognome!" }]}
            />

            {/* studentId */}
            <ProFormText
                name="studentId"
                fieldProps={{ size: "large", prefix: <IdcardOutlined className="prefixIcon" /> }}
                placeholder="Matricola / Student ID"
                rules={[{ required: true, message: "Inserisci la matricola!" }]}
            />

            {/* username + validator remoto */}
            <ProFormText
                name="username"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Username"
                formItemProps={{ hasFeedback: true, validateFirst: true }}
                validateTrigger={["onBlur", "onSubmit"]}
                rules={[
                    { required: true, message: "Inserisci lo username!" },
                    {
                        async validator(_, value) {
                            if (!value) return Promise.resolve();
                            const exists = await queryClient.fetchQuery({
                                queryKey: ["check-username", value],
                                queryFn: () => checkUsername(value), // true = già in uso
                                staleTime: 5 * 60 * 1000,
                                retry: false,
                            });
                            return exists
                                ? Promise.reject(new Error("Username già in uso"))
                                : Promise.resolve();
                        },
                    },
                ]}
            />

            {/* email + validator remoto */}
            <ProFormText
                name="email"
                fieldProps={{ size: "large", prefix: <MailOutlined className="prefixIcon" /> }}
                placeholder="Email"
                formItemProps={{ hasFeedback: true, validateFirst: true }}
                validateTrigger={["onBlur", "onSubmit"]}
                rules={[
                    { required: true, message: "Inserisci la email!" },
                    { type: "email", message: "Email non valida!" },
                    {
                        async validator(_, value) {
                            if (!value) return Promise.resolve();
                            const exists = await queryClient.fetchQuery({
                                queryKey: ["check-email", value],
                                queryFn: () => checkEmail(value), // true = già registrata
                                staleTime: 5 * 60 * 1000,
                                retry: false,
                            });
                            return exists
                                ? Promise.reject(new Error("Email già registrata"))
                                : Promise.resolve();
                        },
                    },
                ]}
            />

            {/* universitaId (select) */}
            <ProFormSelect
                name="universitaId"
                label="Università"
                placeholder="Seleziona l'università"
                options={uniOptions}
                rules={[{ required: true, message: "Seleziona l'università!" }]}
                fieldProps={{
                    size: "large",
                    prefix: <BankOutlined />,
                    onChange: (val) => setSelectedUniId(val),
                }}
            />

            {/* dipartimentoId (select dipendente) */}
            <ProFormSelect
                name="dipartimentoId"
                label="Dipartimento"
                placeholder="Seleziona il dipartimento"
                rules={[{ required: true, message: "Seleziona il dipartimento!" }]}
                fieldProps={{
                    size: "large",
                    prefix: <ApartmentOutlined />,
                    disabled: !selectedUniId,
                }}
                // usa request per caricare le opzioni in base all'università selezionata
                request={async () => {
                    if (!selectedUniId) return [];
                    const items = await fetchDipartimentiByUni(Number(selectedUniId));
                    return items;
                }}
                // forza il refresh quando cambia l'università
                params={{ selectedUniId }}
            />

            {/* password */}
            <ProFormText.Password
                name="password"
                fieldProps={{ size: "large", prefix: <LockOutlined className="prefixIcon" /> }}
                placeholder="Password"
                formItemProps={{ hasFeedback: true }}
                rules={[{ required: true, message: "Inserisci la password!" }]}
            />

            {/* confirm */}
            <ProFormText.Password
                name="confirm"
                dependencies={["password"]}
                fieldProps={{ size: "large", prefix: <LockOutlined className="prefixIcon" /> }}
                placeholder="Conferma password"
                formItemProps={{ hasFeedback: true }}
                validateTrigger={["onChange", "onBlur", "onSubmit"]}
                rules={[
                    { required: true, message: "Conferma la password!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value) return Promise.resolve();
                            return getFieldValue("password") === value
                                ? Promise.resolve()
                                : Promise.reject(new Error("Le password non coincidono!"));
                        },
                    }),
                ]}
            />
        </>
    );
}

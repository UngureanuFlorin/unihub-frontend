import React, { useState, useMemo } from "react";
import { ProFormSelect, ProFormText, ProFormUploadButton } from "@ant-design/pro-components";
import {
    ApartmentOutlined,
    BankOutlined,
    IdcardOutlined,
    LockOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { checkEmail, checkUsername } from "../../api/checks.api.js";
import { useUniversitaList, useDipartimenti } from "../../queries/universita.queries.js";

export default function RegisterFields() {
    const queryClient = useQueryClient();
    const [selectedUniId, setSelectedUniId] = useState(undefined);

    // 🔹 Carico università dal backend
    const { data: universitaList = [], isLoading: isLoadingUni } = useUniversitaList();

    // 🔹 Carico dipartimenti (solo se un'università è selezionata)
    const { data: dipList = [], isLoading: isLoadingDip } = useDipartimenti(selectedUniId);

    // 🔹 Mappo i dati per le select
    const uniOptions = useMemo(
        () =>
            universitaList.map((u) => ({
                label: u.nome,
                value: u.id,
            })),
        [universitaList]
    );

    const dipOptions = useMemo(
        () =>
            dipList.map((d) => ({
                label: d.nome,
                value: d.id,
            })),
        [dipList]
    );

    return (
        <>
            {/* Nome */}
            <ProFormText
                name="name"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Nome"
                rules={[{ required: true, message: "Inserisci il nome!" }]}
            />

            {/* Cognome */}
            <ProFormText
                name="surname"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Cognome"
                rules={[{ required: true, message: "Inserisci il cognome!" }]}
            />

            {/* Matricola */}
            <ProFormText
                name="studentId"
                fieldProps={{ size: "large", prefix: <IdcardOutlined className="prefixIcon" /> }}
                placeholder="Matricola / Student ID"
                rules={[{ required: true, message: "Inserisci la matricola!" }]}
            />

            {/* Username */}
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
                                queryFn: () => checkUsername(value),
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

            {/* Email */}
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
                                queryFn: () => checkEmail(value),
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

            {/* Foto profilo */}
            <ProFormUploadButton
                name="profileImage"
                label="Foto profilo (opzionale)"
                max={1}
                fieldProps={{
                    listType: "picture",
                    accept: "image/*",
                    beforeUpload: () => false,
                }}
                title="Carica immagine"
            />

            {/* Università */}
            <ProFormSelect
                name="universitaId"
                label="Università"
                placeholder="Seleziona l'università"
                options={uniOptions}
                loading={isLoadingUni}
                rules={[{ required: true, message: "Seleziona l'università!" }]}
                fieldProps={{
                    size: "large",
                    prefix: <BankOutlined />,
                    onChange: (val) => setSelectedUniId(val),
                }}
            />

            {/* Dipartimento */}
            <ProFormSelect
                name="dipartimentoId"
                label="Dipartimento"
                placeholder={
                    selectedUniId
                        ? "Seleziona il dipartimento"
                        : "Seleziona prima un'università"
                }
                options={dipOptions}
                loading={isLoadingDip}
                disabled={!selectedUniId}
                rules={[{ required: true, message: "Seleziona il dipartimento!" }]}
                fieldProps={{
                    size: "large",
                    prefix: <ApartmentOutlined />,
                }}
            />

            {/* Password */}
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className="prefixIcon" />,
                }}
                placeholder="Password"
                formItemProps={{ hasFeedback: true }}
                rules={[{ required: true, message: "Inserisci la password!" }]}
            />

            {/* Conferma Password */}
            <ProFormText.Password
                name="confirm"
                dependencies={["password"]}
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className="prefixIcon" />,
                }}
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

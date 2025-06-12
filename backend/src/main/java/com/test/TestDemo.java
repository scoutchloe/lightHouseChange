package com.test;

import com.lighthouse.exception.BusinessException;
import org.springframework.transaction.interceptor.RollbackRuleAttribute;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;

import java.util.List;

/**
 * @author Scout
 * @date 2025-06-03 12:50
 * @since 1.0
 */
public class TestDemo {
    public static void main(String[] args) {
        // GET /api/v3/api-docs, 结果apiV3: false
        String str = "/api/v3/api-docs";
        System.out.println(str.startsWith("/api/v3/"));

        //System.out.println(Throwable.class.isAssignableFrom(RuntimeException.class));

//        RollbackRuleAttribute rra =  new RollbackRuleAttribute(BusinessException.class);
//        RollbackRuleAttribute rra =  new RollbackRuleAttribute(Throwable.class);
        RollbackRuleAttribute rra =  new RollbackRuleAttribute("haha");
        RollbackRuleAttribute rra2 =  new RollbackRuleAttribute(Exception.class);
        RollbackRuleAttribute rra3 =  new RollbackRuleAttribute("BusinessException");
        RuleBasedTransactionAttribute rbta =  new  RuleBasedTransactionAttribute();
        rbta.setRollbackRules(List.of(rra2, rra, rra3));
//        rbta.setRollbackRules(List.of());
        System.out.println(rbta.rollbackOn(new BusinessException("haha")));
//        System.out.println(RuntimeException.class.getSuperclass());
//        System.out.println(Exception.class.getSuperclass());
//        System.out.println(Exception.class.getSuperclass().getName());
//        System.out.println(Exception.class.getSuperclass().getSuperclass());
    }
}